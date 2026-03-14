import { Metadata } from 'next';
import JobListingForm from "@/components/JobListingForm";
import { Suspense } from 'react';
import { getReusableCompanies } from "@/lib/jobs";

const SITE_URL = "https://www.web3jobsboard.com";

export const metadata: Metadata = {
  title: 'Post a Web3 Job | Reach Top Blockchain & Crypto Talent',
  description: 'Recruit top talent in the blockchain & Web3 space. Post your job opening on Web3 Jobs Board today – reach developers, marketers, designers, and more.',
  keywords: 'post web3 job, post blockchain job, hire web3 talent, blockchain recruitment, crypto jobs, web3 careers, list job vacancy, web3 job board, hire crypto developer',
  openGraph: {
    title: 'Post a Web3 Job | Web3 Jobs Board',
    description: 'Easily list your Web3 or blockchain job openings and connect with thousands of qualified crypto candidates.',
    url: `${SITE_URL}/post-job`,
    siteName: 'Web3 Jobs Board',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Post a Web3 Job on Web3 Jobs Board',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Post a Web3 Job | Web3 Jobs Board',
    description: 'Recruit top talent in the blockchain & Web3 space. Post your job opening on Web3 Jobs Board today.',
    site: '@Web3JobsBoard',
    creator: '@Web3JobsBoard',
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: `${SITE_URL}/post-job`,
  },
};

async function PostJobPage() {
  const reusableCompanies = await getReusableCompanies();

  return (
    <div className="mt-[3.75rem] md:mt-[5.5rem]">
      {/* Newspaper-style page header */}
      <div className="border-b-4 border-foreground px-4 sm:px-6 lg:px-8 py-6">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#CC0000] mb-2">
          ■ Recruitment &amp; Listings
        </p>
        <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none uppercase">
          Post a Job
        </h1>
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-3">
          Reach top Web3 talent — fill in the details below to publish your listing
        </p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
        <Suspense fallback={
          <div className="border border-foreground p-10 font-sans text-sm uppercase tracking-widest text-muted-foreground">
            Loading form...
          </div>
        }>
          <JobListingForm reusableCompanies={reusableCompanies} />
        </Suspense>
      </div>
    </div>
  );
}

export default PostJobPage;
