// app/page.tsx
import { Suspense } from "react";
import Script from "next/script";
import HeroSection from "@/components/HeroSection";
import JobsSection from "@/components/JobsSection";
import SpinnerJobs from "@/components/SpinnerJobs";
import { getJobKeywords, getJobListings } from "@/lib/actions";
import { Metadata } from "next";

const SITE_URL = "https://www.web3jobsboard.com";

export async function generateMetadata(): Promise<Metadata> {
  const keywords = await getJobKeywords();
  const description =
    "Browse and post Web3 & crypto job listings—remote engineering, design, marketing and more on Web3JobsBoard.";
  return {
    title: "Web3 Jobs Board | Web3 & Crypto Careers",
    description,
    keywords: keywords.join(", "),
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: "Web3 Jobs Board | Web3 & Crypto Careers",
      description,
      url: SITE_URL,
      siteName: "Web3 Jobs Board",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Web3 Jobs Board | Web3 & Crypto Careers",
      description,
      images: [`${SITE_URL}/og-image.png`],
      site: "@Web3JobsBoard",
      creator: "@Web3JobsBoard",
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function Page() {
  const [jobs, keywords] = await Promise.all([
    getJobListings(),
    getJobKeywords(),
  ]);

  const jobPostingList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobs.map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/jobs/${job.id}`,
      item: {
        "@type": "JobPosting",
        title: job.jobTitle,
        datePosted: job.created_at,
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
        hiringOrganization: {
          "@type": "Organization",
          name: job.companyName,
          sameAs: job.companyWebsite,
          logo: job.companyLogo,
        },
        employmentLocationType: job.jobLocation?.toUpperCase(),
        description: job.jobDescription,
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
      },
    })),
  };

  const webSiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Web3JobsBoard",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Script
        id="schema-jobs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobPostingList),
        }}
      />
      <Script
        id="schema-site"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteLd),
        }}
      />

      <main role="main">
        <HeroSection />
        <Suspense fallback={<SpinnerJobs />}>
          <JobsSection jobs={jobs} keywords={keywords} />
        </Suspense>
      </main>
    </>
  );
}
