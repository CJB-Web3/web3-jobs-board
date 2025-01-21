import { CompanyForm, JobForm } from "./types";

export const defaultCompanyValues: CompanyForm = {
  companyName: "",
  companyDescription: "",
  companyLogo: null,
  companyWebsite: "",
  companyEmail: "",
  companyTwitter: "",
  companyDiscord: "",
};

export const defaultJobValues: JobForm = {
  jobTitle: "",
  jobDescription: "",
  role: "Design",
  partTime: false,
  fullTime: false,
  freelance: false,
  internship: false,
  jobLocation: "onsite",
  locationDetails: "",
  remoteOption: "global",
  geographicRestrictions: "",
  timezoneRestrictions: "",
  keywords: "",
  salaryCurrency: "USD",
  minSalary: "",
  maxSalary: "",
  minEquity: "",
  maxEquity: "",
  paymentMethod: "Cash",
  applyMethod: "website",
  applyWebsite: "",
  applyEmail: "",
};
