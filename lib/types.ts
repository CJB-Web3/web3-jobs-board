export type JobForm = {
  jobTitle?: string;
  jobDescription?: string;
  role?:
    | "Design"
    | "Engineering"
    | "Marketing"
    | "Operations"
    | "Support"
    | "Sales"
    | "Other";
  partTime?: boolean;
  fullTime?: boolean;
  freelance?: boolean;
  internship?: boolean;
  jobLocation?: "remote" | "onsite" | "hybrid";
  locationDetails?: string;
  remoteOption?: "global" | "geographic" | "timezone";
  geographicRestrictions?: string;
  timezoneRestrictions?: string;
  keywords?: string;
  salaryCurrency?: "USD" | "EUR" | "GBP";
  minSalary?: string;
  maxSalary?: string;
  minEquity?: string;
  maxEquity?: string;
  paymentMethod?: "Cash" | "Cryptocurrency" | "Hybrid";
  applyMethod?: "website" | "email";
  applyEmail?: string;
  applyWebsite?: string;
};

export type CompanyForm = {
  companyName?: string;
  companyDescription?: string;
  companyLogo?: File | null;
  companyWebsite?: string;
  companyEmail?: string;
  companyTwitter?: string;
  companyDiscord?: string;
};

export type JobListing = JobForm & CompanyForm;

export type PaymentForm = {
  jobPkg: string;
  paymentCurrency: "usd" | "eur" | "gbp";
};

export type JobData = {
  id: number;
  created_at: string;
  companyName?: string;
  companyDescription?: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyEmail?: string;
  companyTwitter?: string;
  companyDiscord?: string;
  jobTitle?: string;
  jobDescription?: string;
  role?:
    | "Design"
    | "Engineering"
    | "Marketing"
    | "Operations"
    | "Support"
    | "Sales"
    | "Other";
  partTime?: boolean;
  fullTime?: boolean;
  freelance?: boolean;
  internship?: boolean;
  jobLocation?: "remote" | "onsite" | "hybrid";
  locationDetails?: string;
  remoteOption?: "global" | "geographic" | "timezone";
  geographicRestrictions?: string;
  timezoneRestrictions?: string;
  keywords?: string;
  salaryCurrency?: "USD" | "EUR" | "GBP";
  minSalary?: string;
  maxSalary?: string;
  minEquity?: string;
  maxEquity?: string;
  paymentMethod?: "Cash" | "Cryptocurrency" | "Cash/Crypto";
  applyMethod?: "website" | "email";
  applyEmail?: string;
  applyWebsite?: string;
  featured: boolean;
  paymentStatus: "unpaid" | "paid";
  paymentCurrency: "usd" | "eur" | "gbp";
  payableAmount: number;
};

export type companyData = {
  id: number;
  companyName: string;
  companyDescription: string;
  companyLogo: string;
  companyWebsite: string;
  companyEmail: string | null;
  companyTwitter: string | null;
  companyDiscord: string | null;
  activeJobs: JobData[];
};
