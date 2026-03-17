import { MetadataRoute } from "next";
import { getJobListings, getLiveCompanies } from "@/lib/jobs";
import { slugify } from "@/lib/utils";

const SITE_URL = "https://www.web3jobsboard.com";
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/companies`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/pricing`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/post-job`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [jobs, companies] = await Promise.all([
      getJobListings(),
      getLiveCompanies(),
    ]);

    const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
      url: `${SITE_URL}/job-details/${job.id}-${slugify(job.jobTitle || "")}`,
      lastModified: job.created_at ? new Date(job.created_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    const companyRoutes: MetadataRoute.Sitemap = companies.map((company) => ({
      url: `${SITE_URL}/companies/${encodeURIComponent(
        company.companyName.replaceAll(" ", "_")
      )}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...STATIC_ROUTES, ...jobRoutes, ...companyRoutes];
  } catch {
    return STATIC_ROUTES;
  }
}
