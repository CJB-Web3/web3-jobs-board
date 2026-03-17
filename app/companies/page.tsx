import CompanyCard from "@/components/CompanyCard";
import Spinner from "@/components/Spinner";
import { getLiveCompanies } from "@/lib/jobs";
import { Righteous } from "next/font/google";
import { Suspense } from "react";
import { Metadata } from "next";

const SITE_URL = "https://www.web3jobsboard.com";

export const metadata: Metadata = {
  title: "Web3 & Blockchain Companies Hiring Now | Web3 Jobs Board",
  description:
    "Discover top Web3, blockchain and crypto companies actively hiring. Explore innovative DeFi, NFT, and blockchain startups offering exciting career opportunities.",
  keywords:
    "web3 companies, blockchain companies, crypto startups, DeFi companies, NFT companies, blockchain employers, web3 employers, crypto firms hiring",
  alternates: { canonical: `${SITE_URL}/companies` },
  openGraph: {
    title: "Top Web3 & Blockchain Companies Hiring Now",
    description:
      "Discover top Web3, blockchain and crypto companies actively hiring. Explore innovative DeFi, NFT, and blockchain startups offering exciting career opportunities.",
    url: `${SITE_URL}/companies`,
    siteName: "Web3 Jobs Board",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Web3 & Blockchain Companies Hiring",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Web3 & Blockchain Companies Hiring Now",
    description:
      "Discover top Web3, blockchain and crypto companies actively hiring.",
    images: [`${SITE_URL}/og-image.png`],
    site: "@Web3JobsBoard",
    creator: "@Web3JobsBoard",
  },
};

const righteous_font = Righteous({ subsets: ["latin"], weight: "400" });

async function Page() {
  const companies = await getLiveCompanies();

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-8 mt-36 mb-20">
      <div className="space-y-4 mb-10">
        <h1
          className={`font-bold text-primary text-4xl ${righteous_font.className}`}
        >
          Featured crypto startups
        </h1>
        <p className="text-lg text-muted-foreground font-normal">
          Explore innovative companies shaping the future of blockchain and
          cryptocurrency. These trailblazers are not only transforming
          industries but also offering exciting career opportunities. Discover
          your next role with visionary startups redefining the digital
          landscape.
        </p>
        <p className="font-mono text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{companies.length}</span>{" "}
          {companies.length === 1 ? "company" : "companies"} listed
        </p>
      </div>

      <Suspense fallback={<Spinner />}>
        <h2 className="sr-only">Company List</h2>
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-6">
          {companies?.map((company, id) => (
            <CompanyCard key={id} companyInfo={company} />
          ))}
        </div>
      </Suspense>
    </main>
  );
}

export default Page;
