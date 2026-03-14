// app/page.tsx
import { Suspense } from "react";
import Script from "next/script";
import HeroSection from "@/components/HeroSection";
import JobsSection from "@/components/JobsSection";
import SpinnerJobs from "@/components/SpinnerJobs";
import { getJobKeywords, getJobListings } from "@/lib/jobs";
import { Metadata } from "next";

const SITE_URL = "https://www.web3jobsboard.com";

const CORE_KEYWORDS = [
  "web3 jobs",
  "blockchain jobs",
  "crypto jobs",
  "DeFi jobs",
  "NFT jobs",
  "remote web3 jobs",
  "blockchain developer jobs",
  "smart contract jobs",
  "web3 careers",
  "crypto careers",
  "blockchain careers",
  "web3 job board",
  "cryptocurrency jobs",
  "Solidity developer jobs",
  "web3 marketing jobs",
  "web3 engineer",
  "crypto remote jobs",
];

export async function generateMetadata(): Promise<Metadata> {
  const dynamicKeywords = await getJobKeywords();
  const allKeywords = [...new Set([...CORE_KEYWORDS, ...dynamicKeywords])];
  const description =
    "Find the best Web3 jobs, blockchain careers, and crypto opportunities. Browse remote DeFi, NFT, engineering, design, and marketing roles on Web3 Jobs Board.";
  return {
    title: "Web3 Jobs Board | #1 Blockchain & Crypto Job Board",
    description,
    keywords: allKeywords.join(", "),
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: "Web3 Jobs Board | #1 Blockchain & Crypto Job Board",
      description,
      url: SITE_URL,
      siteName: "Web3 Jobs Board",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Web3 Jobs Board - Find Top Web3, Blockchain & Crypto Jobs",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Web3 Jobs Board | #1 Blockchain & Crypto Job Board",
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
      url: `${SITE_URL}/job-details/${job.id}`,
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
        description: job.jobDescription ?? undefined,
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
    name: "Web3 Jobs Board",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Web3 Jobs Board",
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    sameAs: [
      "https://twitter.com/Web3JobsBoard",
    ],
    description:
      "Web3 Jobs Board is the leading job board for Web3, blockchain, DeFi, NFT, and crypto careers. Find remote and on-site roles across engineering, design, marketing, and more.",
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
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationLd),
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
