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
  const comLogoName = `${Math.random()}-${newJob.companyLogo.name}`.replaceAll(
    "/",
    ""
  );

  const comLogoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/companyLogo/${comLogoName}`;

  // For crypto payments, we'll use USD pricing only
  const amount = newJob.featured ? 150 : 80;

  if (newJob.minEquity === "") {
    newJob.minEquity = null;
  }

  if (newJob.maxEquity === "") {
    newJob.maxEquity = null;
  }

  if (newJob.minSalary === "") {
    newJob.minSalary = null;
  }

  if (newJob.maxSalary === "") {
    newJob.maxSalary = null;
  }

  try {
    // 1. Upload the company logo first
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

    // 2. Insert the new job into the database with paymentStatus as "unpaid"
    const { data, error } = await supabase
      .from("jobs")
      .insert([{ 
        ...newJob, 
        companyLogo: comLogoUrl, 
        payableAmount: amount,
        paymentStatus: "unpaid",
        paymentMethod: "Cryptocurrency"
      }])
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("Failed to create job posting");
    }

    const job = data[0] as JobData;

    // Return the job data without client secret (no Stripe)
    return {
      clientSecret: "crypto", // Dummy value for compatibility
      job: job,
    };
  } catch (error) {
    console.error("Error creating job posting:", error);
    throw error;
  }
}

export async function updateJobPaymentStatus(jobId: number, transactionHash: string) {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .update({ 
        paymentStatus: "paid",
        transactionHash: transactionHash,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
      })
      .eq("id", jobId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as JobData;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
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

export async function getJob(jobId: number) {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (error) {
      throw error;
    }

    return data as JobData;
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
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
