import type { ElementType } from "react";
import { useMemo } from "react";
import { Righteous } from "next/font/google";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RichTextContent from "@/components/RichTextContent";
import { JobData } from "@/lib/types";
import { formatDistanceFromNow, formatSalaryCurrency } from "@/lib/utils";
import {
  BriefcaseBusiness,
  CircleDollarSign,
  Globe,
  Handshake,
  ScrollText,
  Wallet,
} from "lucide-react";

const righteous = Righteous({ subsets: ["latin"], weight: "400" });

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <span className="text-base">{value}</span>
    </div>
  );
}

function Keywords({ keywords }: { keywords?: string }) {
  const keywordList = useMemo(
    () => (keywords ? keywords.split(",").map((keyword) => keyword.trim()) : []),
    [keywords]
  );

  if (keywordList.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keywordList.map((keyword) => (
        <Badge className="rounded-sm text-sm" key={keyword}>
          {keyword}
        </Badge>
      ))}
    </div>
  );
}

export default function JobDetails({ job }: { job: JobData }) {
  const jobType = useMemo(() => {
    if (job.fullTime) return "Full-time";
    if (job.partTime) return "Part-time";
    if (job.freelance) return "Freelance";
    if (job.internship) return "Internship";
    return "Not specified";
  }, [job.fullTime, job.partTime, job.freelance, job.internship]);

  const salaryRange = useMemo(() => {
    if (job.minSalary && job.maxSalary && job.salaryCurrency) {
      return `${formatSalaryCurrency(
        Number(job.minSalary),
        job.salaryCurrency
      )} - ${formatSalaryCurrency(Number(job.maxSalary), job.salaryCurrency)}`;
    }

    return "Not specified";
  }, [job.minSalary, job.maxSalary, job.salaryCurrency]);

  const equityRange = useMemo(() => {
    if (job.minEquity != null && job.maxEquity != null) {
      return `${job.minEquity}% - ${job.maxEquity}%`;
    }

    return null;
  }, [job.minEquity, job.maxEquity]);

  const locationDetails = useMemo(() => {
    switch (job.jobLocation) {
      case "onsite":
        return `On site - ${job.locationDetails || ""}`;
      case "remote":
        if (job.remoteOption === "global") return "Remote - Global";
        if (job.remoteOption === "geographic") {
          return `Remote - ${job.geographicRestrictions || ""}`;
        }
        if (job.remoteOption === "timezone") {
          return `Remote - ${job.timezoneRestrictions || ""}`;
        }
        return "Remote";
      case "hybrid": {
        const baseText = `On site or Remote - ${job.locationDetails || ""}`;
        if (job.remoteOption === "global") return `${baseText}, Global`;
        if (job.remoteOption === "geographic") {
          return `${baseText}, ${job.geographicRestrictions || ""}`;
        }
        if (job.remoteOption === "timezone") {
          return `${baseText}, ${job.timezoneRestrictions || ""}`;
        }
        return baseText;
      }
      default:
        return "Not specified";
    }
  }, [
    job.jobLocation,
    job.locationDetails,
    job.remoteOption,
    job.geographicRestrictions,
    job.timezoneRestrictions,
  ]);

  const applyLink = useMemo(() => {
    if (job.applyMethod === "website") {
      return job.applyWebsite || "#";
    }

    return `mailto:${job.applyEmail || ""}`;
  }, [job.applyEmail, job.applyMethod, job.applyWebsite]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={job.companyLogo || undefined} alt={job.companyName || "Company logo"} />
            <AvatarFallback>{(job.companyName || "C")[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className={`text-5xl font-bold tracking-wide ${righteous.className}`}>
              {job.jobTitle || "Job Listing"}
            </h1>
            <h2 className="text-2xl md:text-3xl text-center md:flex md:items-center md:text-left gap-2 font-medium mt-4 tracking-wide">
              {job.companyName || "Company"}
            </h2>
            {job.role && (
              <Badge variant="secondary" className="mt-4 rounded-md text-sm px-3 py-1">
                {job.role}
              </Badge>
            )}
            <p className="mt-4 text-sm dark:text-muted-foreground font-medium">
              Posted {job.created_at ? formatDistanceFromNow(job.created_at) : "recently"}
            </p>
          </div>
        </div>

        <Card className="mb-8 border-primary">
          <CardContent className="p-6">
            <Keywords keywords={job.keywords} />
            <Separator className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem icon={Globe} label="Location" value={locationDetails} />
              <DetailItem icon={BriefcaseBusiness} label="Job Type" value={jobType} />
              <DetailItem
                icon={CircleDollarSign}
                label="Compensation Range"
                value={salaryRange}
              />
              <DetailItem
                icon={Wallet}
                label="Payment Method"
                value={job.paymentMethod || undefined}
              />
              <DetailItem icon={Handshake} label="Equity" value={equityRange} />
            </div>
          </CardContent>
        </Card>

        <section className="mb-8" aria-label="Job Description">
          <h3 className="text-xl flex items-center mb-4">
            <ScrollText className="w-6 h-6 mr-2 text-primary" />
            Job Description
          </h3>
          <RichTextContent
            html={job.jobDescription}
            className="prose prose-sm dark:prose-invert max-w-none text-foreground/80"
          />
        </section>

        <Separator className="mb-6" />
        <div className="mb-4">
          <Button asChild className="w-full md:w-auto" size="lg">
            <a target="_blank" rel="noopener noreferrer" href={applyLink}>
              Apply Now
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
