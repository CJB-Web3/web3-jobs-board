import "server-only";

import { supabase } from "@/lib/supabase";
import { CompanyData, JobData, ReusableCompany } from "@/lib/types";
import { getToday } from "@/lib/utils";

function aggregateCompanies(jobs: JobData[]): CompanyData[] {
  const companies = new Map<string, CompanyData>();

  for (const job of jobs) {
    const companyName = job.companyName?.trim();
    if (!companyName) {
      continue;
    }

    const key = companyName.toLowerCase();
    const existingCompany = companies.get(key);

    if (!existingCompany) {
      companies.set(key, {
        id: job.id,
        companyName,
        companyDescription: job.companyDescription ?? null,
        companyLogo: job.companyLogo ?? null,
        companyWebsite: job.companyWebsite ?? null,
        companyEmail: job.companyEmail ?? null,
        companyTwitter: job.companyTwitter ?? null,
        companyDiscord: job.companyDiscord ?? null,
        activeJobs: [job],
      });
      continue;
    }

    existingCompany.activeJobs.push(job);
  }

  return Array.from(companies.values());
}

function toReusableCompanies(jobs: JobData[]): ReusableCompany[] {
  const companies = new Map<string, ReusableCompany>();

  for (const job of jobs) {
    const companyName = job.companyName?.trim();
    if (!companyName) {
      continue;
    }

    const key = companyName.toLowerCase();
    if (companies.has(key)) {
      continue;
    }

    companies.set(key, {
      id: job.id,
      companyName,
      companyDescription: job.companyDescription ?? null,
      companyLogo: job.companyLogo ?? null,
      companyWebsite: job.companyWebsite ?? null,
      companyEmail: job.companyEmail ?? null,
      companyTwitter: job.companyTwitter ?? null,
      companyDiscord: job.companyDiscord ?? null,
    });
  }

  return Array.from(companies.values());
}

async function listLiveJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("paymentStatus", "paid")
    .gte("expiryDate", getToday())
    .order("featured", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as JobData[];
}

export async function getJobListings() {
  return listLiveJobs();
}

export async function getPublicJobById(id: number) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("paymentStatus", "paid")
    .gte("expiryDate", getToday())
    .single();

  if (error) {
    return null;
  }

  return data as JobData;
}

export async function getLiveCompanies() {
  return aggregateCompanies(await listLiveJobs());
}

export async function getReusableCompanies() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("paymentStatus", "paid")
    .order("id", { ascending: false });

  if (error) {
    throw error;
  }

  return toReusableCompanies((data ?? []) as JobData[]);
}

export async function getCompanyJobs(companyName: string) {
  const normalizedCompanyName = companyName.trim();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("paymentStatus", "paid")
    .gte("expiryDate", getToday())
    .ilike("companyName", normalizedCompanyName)
    .order("featured", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as JobData[];
}

export async function getSimilarCompanies(companyName: string) {
  const liveCompanies = await getLiveCompanies();
  return liveCompanies.filter(
    (company) => company.companyName.toLowerCase() !== companyName.trim().toLowerCase()
  );
}

export async function getJobKeywords() {
  const { data, error } = await supabase
    .from("jobs")
    .select("keywords")
    .eq("paymentStatus", "paid")
    .gte("expiryDate", getToday());

  if (error) {
    throw error;
  }

  const uniqueKeywords = new Set<string>();

  for (const record of data ?? []) {
    const keywords = String(record.keywords ?? "")
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    for (const keyword of keywords) {
      uniqueKeywords.add(keyword);
    }
  }

  return Array.from(uniqueKeywords);
}
