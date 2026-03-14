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
  paymentCurrency: "usd";
};

export type JobData = {
  id: number;
  created_at: string;
  companyName?: string;
  companyDescription?: string;
  companyLogo?: string | null;
  companyWebsite?: string | null;
  companyEmail?: string | null;
  companyTwitter?: string | null;
  companyDiscord?: string | null;
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
  locationDetails?: string | null;
  remoteOption?: "global" | "geographic" | "timezone";
  geographicRestrictions?: string | null;
  timezoneRestrictions?: string | null;
  keywords?: string;
  salaryCurrency?: "USD" | "EUR" | "GBP" | null;
  minSalary?: string | null;
  maxSalary?: string | null;
  minEquity?: string | null;
  maxEquity?: string | null;
  paymentMethod?: "Cash" | "Cryptocurrency" | "Hybrid" | null;
  applyMethod?: "website" | "email";
  applyEmail?: string | null;
  applyWebsite?: string | null;
  featured: boolean;
  paymentStatus: "unpaid" | "paid";
  paymentCurrency: "usd";
  payableAmount: number;
  expiryDate?: string | null;
  transactionHash?: string | null;
};

export type CompanyData = {
  id: number;
  companyName: string;
  companyDescription: string | null;
  companyLogo: string | null;
  companyWebsite: string | null;
  companyEmail: string | null;
  companyTwitter: string | null;
  companyDiscord: string | null;
  activeJobs: JobData[];
};

export type companyData = CompanyData;

export type ReusableCompany = {
  id: number;
  companyName: string;
  companyDescription: string | null;
  companyLogo: string | null;
  companyWebsite: string | null;
  companyEmail: string | null;
  companyTwitter: string | null;
  companyDiscord: string | null;
};
