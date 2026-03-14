import PricingSection from "@/components/PricingSection";
import { Metadata } from "next";

const SITE_URL = "https://www.web3jobsboard.com";

export const metadata: Metadata = {
  title: "Pricing | Post a Web3 & Blockchain Job Listing",
  description:
    "Simple, transparent pricing for posting Web3 and blockchain job listings. Reach thousands of qualified crypto, DeFi, and blockchain professionals. Pay with stablecoins.",
  keywords:
    "web3 job posting cost, blockchain job listing price, crypto recruitment pricing, post web3 job, hire blockchain developer, web3 job board pricing",
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: "Pricing | Post a Web3 & Blockchain Job Listing",
    description:
      "Simple, transparent pricing for posting Web3 and blockchain job listings. Reach thousands of qualified crypto and DeFi professionals.",
    url: `${SITE_URL}/pricing`,
    siteName: "Web3 Jobs Board",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Web3 Jobs Board Pricing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Post a Web3 & Blockchain Job Listing",
    description:
      "Simple, transparent pricing for posting Web3 and blockchain job listings.",
    images: [`${SITE_URL}/og-image.png`],
    site: "@Web3JobsBoard",
    creator: "@Web3JobsBoard",
  },
};

function Page() {
  return (
    <main className="min-h-screen mt-24 mb-16">
      <PricingSection />
    </main>
  );
}

export default Page;
