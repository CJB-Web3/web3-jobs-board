import CompanyCard from "@/components/CompanyCard";
import RichTextContent from "@/components/RichTextContent";
import JobCard from "@/components/JobCard";
import { getCompanyJobs, getSimilarCompanies } from "@/lib/jobs";
import { Building2, Globe, LucideBellDot, MailIcon } from "lucide-react";
import { Righteous } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import { Metadata } from "next";

const SITE_URL = "https://www.web3jobsboard.com";

const righteous_font = Righteous({
  subsets: ["latin"],
  weight: "400",
});

type PageProps = {
  params: Promise<{ companyName: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { companyName } = await params;
  const cleanedCompanyName = companyName.replaceAll("_", " ");
  const companyJobs = await getCompanyJobs(cleanedCompanyName);

  if (companyJobs.length === 0) {
    return { title: "Company Not Found | Web3 Jobs Board" };
  }

  const company = companyJobs[0];
  const rawDescription = company.companyDescription
    ?.replace(/<[^>]+>/g, "")
    .slice(0, 160) || "";
  const description =
    rawDescription ||
    `Explore open Web3 jobs at ${company.companyName}. Join a leading blockchain company and advance your crypto career.`;
  const canonicalUrl = `${SITE_URL}/companies/${encodeURIComponent(
    companyName
  )}`;

  return {
    title: `${company.companyName} Web3 Jobs | Blockchain Careers`,
    description,
    keywords: `${company.companyName} jobs, ${company.companyName} careers, web3 jobs, blockchain jobs, crypto jobs`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${company.companyName} | Web3 Jobs & Blockchain Careers`,
      description,
      url: canonicalUrl,
      siteName: "Web3 Jobs Board",
      images: [
        {
          url: company.companyLogo || `${SITE_URL}/og-image.png`,
          width: 800,
          height: 600,
          alt: `${company.companyName} logo`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${company.companyName} | Web3 Jobs & Blockchain Careers`,
      description,
      images: [company.companyLogo || `${SITE_URL}/og-image.png`],
      site: "@Web3JobsBoard",
      creator: "@Web3JobsBoard",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ companyName: string }>;
}) {
  const { companyName } = await params;

  const cleanedCompanyName = companyName.replaceAll("_", " ");

  const companyJobs = await getCompanyJobs(cleanedCompanyName);
  const similarCompanies = await getSimilarCompanies(cleanedCompanyName);

  const company = companyJobs[0];
  const canonicalUrl = `${SITE_URL}/companies/${encodeURIComponent(companyName)}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Companies",
        item: `${SITE_URL}/companies`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: company?.companyName || cleanedCompanyName,
        item: canonicalUrl,
      },
    ],
  };

  const organizationLd = company
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: company.companyName,
        url: company.companyWebsite || canonicalUrl,
        logo: company.companyLogo || undefined,
        email: company.companyEmail || undefined,
        sameAs: [
          company.companyWebsite,
          company.companyTwitter,
          company.companyDiscord,
        ].filter(Boolean),
        description: company.companyDescription
          ?.replace(/<[^>]+>/g, "")
          .slice(0, 500),
      }
    : null;

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-36 mb-20">
      <Script
        id="schema-breadcrumb-company"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {organizationLd && (
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
      )}
      {companyJobs.length === 0 ? (
        <div>
          <p className="text-center text-muted-foreground text-sm">
            No company found
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 sm:gap-16">
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-center">
            {companyJobs[0].companyLogo ? (
              <Image
                src={companyJobs[0].companyLogo}
                width={150}
                height={150}
                className="object-cover rounded-full border w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56"
                alt={`${companyJobs[0].companyName} logo`}
                priority
              />
            ) : (
              <div className="rounded-full border w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-muted" />
            )}

            <div>
              <h1
                className={`text-4xl sm:text-5xl lg:text-7xl font-bold ${righteous_font.className} text-center sm:text-left`}
              >
                {companyJobs[0].companyName}
              </h1>

              <div className="flex gap-2 mt-4 items-center">
                {companyJobs[0].companyWebsite && (
                  <a
                    href={companyJobs[0].companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${companyJobs[0].companyName} website`}
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-primary transition-colors duration-300 ease-in-out"
                  >
                    <Globe className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors duration-300 ease-in-out" />
                  </a>
                )}

                {companyJobs[0].companyEmail && (
                  <Link
                    href={`mailto:${companyJobs[0].companyEmail}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Email ${companyJobs[0].companyName}`}
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-primary transition-colors duration-300 ease-in-out"
                  >
                    <MailIcon className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors duration-300 ease-in-out" />
                  </Link>
                )}

                {companyJobs[0].companyTwitter && (
                  <a
                    href={companyJobs[0].companyTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${companyJobs[0].companyName} on X (Twitter)`}
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-primary transition-colors duration-300 ease-in-out"
                  >
                    <FaXTwitter className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors duration-300 ease-in-out" />
                  </a>
                )}

                {companyJobs[0].companyDiscord && (
                  <a
                    href={companyJobs[0].companyDiscord}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${companyJobs[0].companyName} Discord`}
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-primary transition-colors duration-300 ease-in-out"
                  >
                    <FaDiscord className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors duration-300 ease-in-out" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2
              className={`text-2xl sm:text-3xl text-primary flex items-center gap-2 ${righteous_font.className}`}
            >
              About {companyJobs[0].companyName}
            </h2>

            <RichTextContent
              html={companyJobs[0].companyDescription}
              className="text-muted-foreground"
            />
          </div>

          <div className="flex flex-col gap-4">
            <h2
              className={`text-2xl sm:text-3xl text-primary tracking-wide flex items-center gap-2 ${righteous_font.className}`}
            >
              <LucideBellDot size={24} />
              Active jobs
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {companyJobs.map((job) => (
                <div key={job.id} className="border border-foreground">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2
              className={`text-2xl sm:text-3xl text-primary tracking-wide flex items-center gap-2 ${righteous_font.className}`}
            >
              <Building2 size={24} />
              Other Companies
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {similarCompanies.map((company, id) => (
                <CompanyCard key={id} companyInfo={company} />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
