import type { ElementType, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
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

function computeJobType(job: JobData) {
  if (job.fullTime) return "Full-time";
  if (job.partTime) return "Part-time";
  if (job.freelance) return "Freelance";
  if (job.internship) return "Internship";
  return "Not specified";
}

function computeSalaryRange(job: JobData) {
  if (job.minSalary && job.maxSalary && job.salaryCurrency) {
    return `${formatSalaryCurrency(Number(job.minSalary), job.salaryCurrency)} - ${formatSalaryCurrency(
      Number(job.maxSalary),
      job.salaryCurrency
    )}`;
  }

  return "Not specified";
}

function computeEquityRange(job: JobData) {
  if (job.minEquity != null && job.maxEquity != null) {
    return `${job.minEquity}% - ${job.maxEquity}%`;
  }

  return null;
}

function computeLocationDetails(job: JobData) {
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
    case "hybrid":
      if (job.remoteOption === "global") {
        return `On site or Remote - ${job.locationDetails || ""}, Global`;
      }
      if (job.remoteOption === "geographic") {
        return `On site or Remote - ${job.locationDetails || ""}, ${job.geographicRestrictions || ""}`;
      }
      if (job.remoteOption === "timezone") {
        return `On site or Remote - ${job.locationDetails || ""}, ${job.timezoneRestrictions || ""}`;
      }
      return `On site or Remote - ${job.locationDetails || ""}`;
    default:
      return "";
  }
}

export default function JobPreviewContent({
  job,
  showPostedAt = true,
}: {
  job: JobData;
  showPostedAt?: boolean;
}) {
  const jobType = computeJobType(job);
  const salaryRange = computeSalaryRange(job);
  const equityRange = computeEquityRange(job);
  const locationDetails = computeLocationDetails(job);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-muted">
          {job.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={job.companyLogo}
              alt={job.companyName || ""}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-2xl text-foreground">
              {job.companyName?.[0] || "C"}
            </span>
          )}
        </div>
        <div>
          <h2 className="font-headline text-4xl text-foreground">
            {job.companyName}
          </h2>
          {job.role && (
            <Badge
              variant="secondary"
              className="mt-2 rounded-md px-3 py-1 text-sm font-semibold"
            >
              {job.role}
            </Badge>
          )}
          {showPostedAt && (
            <p className="mt-4 text-sm text-muted-foreground">
              Posted {formatDistanceFromNow(job.created_at)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium md:text-2xl">Role - {job.jobTitle}</h3>
        {job.keywords && (
          <div className="flex flex-wrap gap-2">
            {job.keywords.split(",").map((keyword) => (
              <Badge className="rounded-sm" key={keyword.trim()}>
                {keyword.trim()}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 text-lg md:grid-cols-2">
        <Detail icon={Globe} label="Location">
          {locationDetails}
        </Detail>
        <Detail icon={BriefcaseBusiness} label="Job Type">
          {jobType}
        </Detail>
        <Detail icon={CircleDollarSign} label="Compensation Range">
          {salaryRange}
        </Detail>
        <Detail icon={Wallet} label="Payment Method">
          {job.paymentMethod}
        </Detail>
        {equityRange && (
          <Detail icon={Handshake} label="Equity">
            {equityRange}
          </Detail>
        )}
      </div>

      <div className="space-y-6">
        <h3 className="flex items-center text-lg">
          <ScrollText className="mr-2 h-6 w-6 text-primary" /> Job Description
        </h3>
        <RichTextContent
          html={job.jobDescription}
          className="prose prose-sm dark:prose-invert max-w-none"
        />
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: ElementType;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Icon className="h-5 w-5 text-primary" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <span className="text-base text-foreground">{children}</span>
    </div>
  );
}
