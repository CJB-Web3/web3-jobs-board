"use server";

import { stripe } from "./stripe";
import { supabase } from "./supabase";
import { JobData } from "./types";
import { getToday } from "./utils";

export async function getPriceInEUR(amount: number) {
  const res = await fetch(process.env.EXCHANGE_RATE_API_URL as string);
  const data = await res.json();

  return (amount * data.conversion_rates.EUR).toFixed(0);
  // return amount * 0.91;
}

export async function getPriceInGBP(amount: number) {
  const res = await fetch(process.env.EXCHANGE_RATE_API_URL as string);
  const data = await res.json();

  return (amount * data.conversion_rates.GBP).toFixed(0);
  // return amount * 0.76;
}

export async function createJobPosting(newJob: any) {
  let amount;

  const comLogoName = `${Math.random()}-${newJob.companyLogo.name}`.replaceAll(
    "/",
    ""
  );

  const comLogoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/companyLogo/${comLogoName}`;

  if (newJob.paymentCurrency === "eur") {
    amount = newJob.featured
      ? await getPriceInEUR(100)
      : await getPriceInEUR(50);
  } else if (newJob.paymentCurrency === "gbp") {
    amount = newJob.featured
      ? await getPriceInGBP(100)
      : await getPriceInGBP(50);
  } else {
    amount = newJob.featured ? 100 : 50;
  }

  if (newJob.minEquity === "") {
    newJob.minEquity = null;
  }

  if (newJob.maxEquity === "") {
    newJob.maxEquity = null;
  }

  // 1. Insert the new job into the database
  const { data, error } = await supabase
    .from("jobs")
    .insert([{ ...newJob, companyLogo: comLogoUrl, payableAmount: amount }])
    .select();
  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("Failed to create job posting");
  }

  const job = data[0] as JobData;
  const { id, paymentCurrency } = job;

  // 2. Create a Stripe PaymentIntent

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: paymentCurrency,
      metadata: {
        jobId: id,
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Stripe failed to create payment intent");
    }

    // 3. Update the job posting with the PaymentIntent ID
    const { data, error: updateError } = await supabase
      .from("jobs")
      .update({ paymentIntentId: paymentIntent.id })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      throw updateError;
    }

    // 4. Upload the company logo
    const { error: uploadError } = await supabase.storage
      .from("companyLogo")
      .upload(
        comLogoName,
        Buffer.from(newJob.companyLogo.base64.split(",")[1], "base64"),
        {
          contentType: newJob.companyLogo.type,
        }
      );

    if (uploadError) throw uploadError;

    // 5. Return the client secret
    return {
      clientSecret: paymentIntent.client_secret,
      job: data as JobData,
    };
  } catch (stripeError) {
    // If Stripe fails, delete the job posting
    await supabase.from("jobs").delete().eq("id", id);
    throw stripeError;
  }
}

export async function getJobListings() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("paymentStatus", "paid")
    .gte("expiryDate", getToday())
    .order("id", { ascending: false });
  if (error) throw error;

  const featuredJobs = data.filter((job: JobData) => job.featured);
  const regularJobs = data.filter((job: JobData) => !job.featured);

  return [...featuredJobs, ...regularJobs] as JobData[];
}

export async function getJob(id: number) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as JobData;
}

export async function getCompanies() {
  const { data, error } = await supabase.from("jobs").select("*");

  if (error) throw error;

  const uniqueCompanies: any[] = [];
  data?.forEach((job) => {
    const alreadyExists = uniqueCompanies.find(
      (uniqJob) =>
        uniqJob.companyName.toLowerCase() === job.companyName.toLowerCase()
    );

    if (!alreadyExists) {
      uniqueCompanies.push(job);
    }
  });

  uniqueCompanies.forEach((uniqJob) => {
    const jobs = data?.filter(
      (job) =>
        job.companyName.toLowerCase() === uniqJob.companyName.toLowerCase()
    );

    uniqJob.activeJobs = jobs;
  });

  return uniqueCompanies;
}

export async function getCompanyJobs(companyName: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("paymentStatus", "paid")
    .gte("expiryDate", getToday())
    .ilike("companyName", `%${companyName}%`);

  if (error) throw error;

  return data as JobData[];
}

export async function getSimilarCompanies(companyName: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .neq("companyName", companyName);

  if (error) throw error;

  const uniqueCompanies: any[] = [];
  data?.forEach((job) => {
    const alreadyExists = uniqueCompanies.find(
      (uniqJob) =>
        uniqJob.companyName.toLowerCase() === job.companyName.toLowerCase()
    );

    if (!alreadyExists) {
      uniqueCompanies.push(job);
    }
  });

  uniqueCompanies.forEach((uniqJob) => {
    const jobs = data?.filter(
      (job) =>
        job.companyName.toLowerCase() === uniqJob.companyName.toLowerCase()
    );

    uniqJob.activeJobs = jobs;
  });

  return uniqueCompanies;
}

export async function getJobById(id: number) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .gte("expiryDate", getToday())
    .single();

  if (error) throw error;

  return data as JobData;
}

export async function getJobKeywords() {
  let uniqueKeywords: string[] = [];

  const { data, error } = await supabase
    .from("jobs")
    .select("keywords")
    .eq("paymentStatus", "paid")
    .gte("expiryDate", getToday());

  if (error) throw error;

  const allKeywords = data.map((keywordArr) => {
    const unrefinedKeywordArr = keywordArr.keywords.split(",");
    const refinedKeywords = unrefinedKeywordArr.map(
      (unrefinedKeyword: string) => unrefinedKeyword.trim()
    );

    return refinedKeywords;
  });

  allKeywords.flat().forEach((curKeyword) => {
    if (!uniqueKeywords.includes(curKeyword)) {
      uniqueKeywords.push(curKeyword);
    }
  });

  return uniqueKeywords;
}
