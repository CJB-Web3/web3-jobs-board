import CompanyCard from "@/components/CompanyCard";
import JobCard from "@/components/JobCard";
import { getCompanyJobs, getSimilarCompanies } from "@/lib/actions";
import binanceLogo from "@/public/companies/binance.png";
import { Building2, Globe, LucideBellDot, MailIcon } from "lucide-react";
import { Righteous } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import ReactHtmlParser from "react-html-parser";
import { FaXTwitter } from "react-icons/fa6";

const righteous_font = Righteous({
  subsets: ["latin"],
  weight: "400",
});


type Params = {
  companyId: string;
};

type Job = {
  id: number;
  title: string;
  company: string;
  logo: string;
  tags: string[];
  daysAgo: number;
  location: string;
  category: string;
  type: string;
  featured: boolean;
  locationType: string;
  compensationRange: string;
};

const jobs: Job[] = [
  {
    id: 1,
    title: "Blockchain Developer",
    company: "Binance Ltd",
    logo: binanceLogo.src,
    tags: ["Solidity", "Ethereum", "Smart Contracts"],
    daysAgo: 2,
    location: "Europe",
    category: "Engineering",
    type: "Full-Time",
    featured: true,
    locationType: "Remote",
    compensationRange: "50k - 100k",
  },
  {
    id: 2,
    title: "Frontend Engineer",
    company: "Binance Ltd",
    logo: binanceLogo.src,
    tags: ["React", "TypeScript", "Web3.js"],
    daysAgo: 5,
    location: "Europe",
    category: "Engineering",
    type: "Full-Time",
    featured: false,
    locationType: "Remote",
    compensationRange: "50k - 100k",
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ companyName: string }>;
}) {
  const { companyName } = await params;

  const cleanedCompanyName = companyName.replaceAll("_", " ");

  const companyJobs = await getCompanyJobs(cleanedCompanyName);
  const similarCompanies = await getSimilarCompanies(cleanedCompanyName);

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-36 mb-20">
      {companyJobs.length === 0 ? (
        <div>
          <p className="text-center text-muted-foreground text-sm">
            No company found 🥲
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 sm:gap-16">
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-center">
            <Image
              src={
                companyJobs[0].companyLogo
                  ? `${companyJobs[0].companyLogo}`
                  : ""
              }
              width={150}
              height={150}
              className="object-cover rounded-full border w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56"
              alt={companyJobs[0].companyName as string}
            />

            <div>
              <h1
                className={`text-4xl sm:text-5xl lg:text-7xl font-bold ${righteous_font.className} text-center sm:text-left`}
              >
                {companyJobs[0].companyName}
              </h1>

              <div className="flex gap-2 mt-4 items-center">
                <a
                  href={companyJobs[0].companyWebsite}
                  target="_blank"
                  className="group flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-primary transition-colors duration-300 ease-in-out"
                >
                  <Globe className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors duration-300 ease-in-out" />
                </a>

                {companyJobs[0].companyEmail && (
                  <Link
                    href={`mailto:${companyJobs[0].companyEmail}`}
                    target="_blank"
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-primary transition-colors duration-300 ease-in-out"
                  >
                    <MailIcon className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors duration-300 ease-in-out" />
                  </Link>
                )}

                {companyJobs[0].companyTwitter && (
                  <a
                    href={companyJobs[0].companyTwitter}
                    target="_blank"
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-primary transition-colors duration-300 ease-in-out"
                  >
                    <FaXTwitter className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors duration-300 ease-in-out" />
                  </a>
                )}

                {companyJobs[0].companyDiscord && (
                  <a
                    href={companyJobs[0].companyDiscord}
                    target="_blank"
                    className="group flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-primary transition-colors duration-300 ease-in-out"
                  >
                    <FaXTwitter className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors duration-300 ease-in-out" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1
              className={`text-2xl sm:text-3xl text-primary flex items-center gap-2 ${righteous_font.className}`}
            >
              About {companyJobs[0].companyName}
            </h1>

            <div className="text-muted-foreground">
              {ReactHtmlParser(companyJobs[0].companyDescription as string)}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1
              className={`text-2xl sm:text-3xl text-primary tracking-wide flex items-center gap-2 ${righteous_font.className}`}
            >
              <LucideBellDot size={24} />
              Active jobs
            </h1>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {companyJobs.map((job) => (
                <div key={job.id} className="flex flex-col gap-2">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1
              className={`text-2xl sm:text-3xl text-primary tracking-wide flex items-center gap-2 ${righteous_font.className}`}
            >
              <Building2 size={24} />
              Other Companies
            </h1>

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
