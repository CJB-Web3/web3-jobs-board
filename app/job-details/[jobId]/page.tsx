import JobDetails from "@/components/JobDetails";
import { getJobById, getJobKeywords } from "@/lib/actions";
import { Metadata } from "next";

const SITE_URL = "https://www.web3jobsboard.com";

export async function generateMetadata({ params }: { params: { jobId: string } }): Promise<Metadata> {
  const id = Number(params.jobId);
  const job = await getJobById(id);
  if (!job) {
    return { title: "Job Not Found | Web3JobsBoard" };
  }
  const description = job.jobDescription?.slice(0, 160).replace(/<[^>]+>/g, '') || '';
  const keywords = await getJobKeywords();
  return {
    title: `${job.jobTitle} at ${job.companyName} | Web3JobsBoard`,
    description,
    keywords: keywords.join(", "),
    alternates: { canonical: `${SITE_URL}/jobs/${job.id}` },
    openGraph: {
      title: `${job.jobTitle} at ${job.companyName}`,
      description,
      url: `${SITE_URL}/jobs/${job.id}`,
      images: [{ url: job.companyLogo || `${SITE_URL}/og-image.png`, width: 800, height: 600 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.jobTitle} at ${job.companyName}`,
      description,
      images: [job.companyLogo || `${SITE_URL}/og-image.png`],
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function Page({ params }: { params: { jobId: string } }) {
  const job = await getJobById(Number(params.jobId));
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 mt-36 mb-20" role="main">
      {job ? <JobDetails job={job} /> : (
        <p className="text-center text-2xl font-bold text-foreground">Job not found</p>
      )}
    </main>
  );
}
