import JobDetails from "@/components/JobDetails";
import { getPublicJobById } from "@/lib/jobs";
import { Metadata } from "next";
import Script from "next/script";

const SITE_URL = "https://www.web3jobsboard.com";

type PageProps = {
  params: Promise<{ jobId: string }>;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobId } = await params;
  const job = await getPublicJobById(Number(jobId));

  if (!job) {
    return { title: "Job Not Found" };
  }

  const plainDescription = job.jobDescription ? stripHtml(job.jobDescription) : "";
  const description = plainDescription.slice(0, 155) || `${job.jobTitle} at ${job.companyName} — apply now on Web3 Jobs Board.`;
  const jobKeywords = job.keywords
    ? `${job.keywords}, web3 jobs, blockchain jobs, crypto jobs`
    : "web3 jobs, blockchain jobs, crypto jobs";

  const ogImage = job.companyLogo || `${SITE_URL}/og-image.png`;

  return {
    title: `${job.jobTitle} at ${job.companyName} | Web3 Jobs Board`,
    description,
    keywords: jobKeywords,
    alternates: { canonical: `${SITE_URL}/job-details/${job.id}` },
    openGraph: {
      title: `${job.jobTitle} at ${job.companyName}`,
      description,
      url: `${SITE_URL}/job-details/${job.id}`,
      siteName: "Web3 Jobs Board",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${job.jobTitle} at ${job.companyName}` }],
      type: "article",
      publishedTime: job.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.jobTitle} at ${job.companyName}`,
      description,
      images: [ogImage],
      site: "@Web3JobsBoard",
      creator: "@Web3JobsBoard",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { jobId } = await params;
  const job = await getPublicJobById(Number(jobId));

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Jobs", item: SITE_URL },
      ...(job
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: `${job.jobTitle} at ${job.companyName}`,
              item: `${SITE_URL}/job-details/${job.id}`,
            },
          ]
        : []),
    ],
  };

  const jobPostingLd = job
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.jobTitle,
        description: job.jobDescription ?? undefined,
        datePosted: job.created_at,
        validThrough: job.expiryDate,
        employmentType: [
          job.fullTime && "FULL_TIME",
          job.partTime && "PART_TIME",
          job.freelance && "CONTRACTOR",
          job.internship && "INTERN",
        ]
          .filter(Boolean)
          .join(", "),
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressRegion:
              job.jobLocation === "remote"
                ? "Remote"
                : job.locationDetails || job.jobLocation,
          },
        },
        jobLocationType:
          job.jobLocation === "remote"
            ? "TELECOMMUTE"
            : job.jobLocation === "hybrid"
            ? "TELECOMMUTE"
            : undefined,
        applicantLocationRequirements:
          job.jobLocation === "remote" && job.remoteOption === "geographic"
            ? {
                "@type": "Country",
                name: job.geographicRestrictions,
              }
            : undefined,
        hiringOrganization: {
          "@type": "Organization",
          name: job.companyName,
          sameAs: job.companyWebsite,
          logo: job.companyLogo,
        },
        baseSalary: job.minSalary
          ? {
              "@type": "MonetaryAmount",
              currency: job.salaryCurrency,
              value: {
                "@type": "QuantitativeValue",
                minValue: Number(job.minSalary),
                maxValue: Number(job.maxSalary),
                unitText: "YEAR",
              },
            }
          : undefined,
        url: `${SITE_URL}/job-details/${job.id}`,
      }
    : null;

  return (
    <>
      <Script
        id="schema-breadcrumb-job"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {jobPostingLd && (
        <Script
          id="schema-job-posting"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingLd) }}
        />
      )}
      <main className="min-h-screen max-w-7xl mx-auto px-4 mt-36 mb-20" role="main">
        {job ? (
          <JobDetails job={job} />
        ) : (
          <p className="text-center text-2xl font-bold text-foreground">Job not found</p>
        )}
      </main>
    </>
  );
}
