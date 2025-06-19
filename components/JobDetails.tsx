import React from 'react'; // <-- Import React for React.createElement
import { useMemo } from "react";
import parse, { domToReact, DOMNode, Element, HTMLReactParserOptions } from "html-react-parser";
import { Righteous } from "next/font/google";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

// Load font outside component
const righteous = Righteous({ subsets: ["latin"], weight: "400" });

// Updated parser options to match JobModal heading style
const createParserOptions = (): HTMLReactParserOptions => ({
  replace: (domNode: DOMNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      // Target heading tags (h1-h6)
      if (/^h[1-6]$/.test(domNode.name)) {
        // Apply styling consistent with JobModal reference
        const headingClass = "text-lg font-medium text-foreground mt-4 mb-2"; // Match reference

        return React.createElement(
          domNode.name, // Keep original tag (h1, h2, etc.)
          { className: headingClass },
          domToReact(domNode.children as DOMNode[], createParserOptions()) // Recursively parse children
        );
      }

    }
    return undefined; // Default handling for other nodes
  },
});

// Separate detail item component (remains the same)
function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: string | null | undefined }) {
  if (!value) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          {label}
        </p>
      </div>
      <span className="text-base">{value}</span>
    </div>
  );
}

// Keywords component (FIXED)
function Keywords({ keywords }: { keywords?: string }) {
  // Always call useMemo at the top level.
  const keywordList = useMemo(() =>
    // Handle conditional logic inside the hook.
    keywords ? keywords.split(",").map(k => k.trim()) : [],
    [keywords]
  );

  // Conditionally render null after the hook call.
  if (keywordList.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keywordList.map((keyword, index) => (
        <Badge className="rounded-sm text-sm" key={index}>
          {keyword}
        </Badge>
      ))}
    </div>
  );
}

// Safe HTML parser component using the updated options (remains the same structurally)
function SafeHTMLContent({ html }: { html: string | undefined }) {
  if (!html) return null;

  try {
    const sanitizedHtml = html
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    // Use the parser with the *updated* createParserOptions
    return <>{parse(sanitizedHtml, createParserOptions())}</>;
  } catch (error) {
    console.error("Error parsing HTML:", error);
    return (
      <div className="whitespace-pre-wrap">
        {html.replace(/<[^>]*>/g, '')}
      </div>
    );
  }
}


// Main JobDetails component (rest remains the same)
export default function JobDetails({ job }: { job: JobData }) {
  // useMemo hooks remain the same
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
      )} - ${formatSalaryCurrency(
        Number(job.maxSalary),
        job.salaryCurrency
      )}`;
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
    const loc = job.jobLocation;
    switch (loc) {
      case "onsite":
        return `On site - ${job.locationDetails || ""}`;
      case "remote":
        if (job.remoteOption === "global") return "Remote - Global";
        if (job.remoteOption === "geographic") return `Remote - ${job.geographicRestrictions || ""}`;
        if (job.remoteOption === "timezone") return `Remote - ${job.timezoneRestrictions || ""}`;
        return "Remote";
      case "hybrid":
        const baseText = `On site or Remote - ${job.locationDetails || ""}`;
        if (job.remoteOption === "global") return `${baseText}, Global`;
        if (job.remoteOption === "geographic") return `${baseText}, ${job.geographicRestrictions || ""}`;
        if (job.remoteOption === "timezone") return `${baseText}, ${job.timezoneRestrictions || ""}`;
        return baseText;
    }
    return "Not specified";
  }, [job.jobLocation, job.locationDetails, job.remoteOption, job.geographicRestrictions, job.timezoneRestrictions]);

  const paymentMethodDisplay = useMemo(() => job.paymentMethod || null, [job.paymentMethod]);

  const applyLink = useMemo(() => {
    if (!job.applyMethod) return "#";
    return job.applyMethod === "website"
      ? (job.applyWebsite || "#")
      : `mailto:${job.applyEmail || ""}`;
  }, [job.applyMethod, job.applyWebsite, job.applyEmail]);


  // JSX Structure remains the same
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={job.companyLogo} alt={job.companyName || "Company logo"} />
            <AvatarFallback>{(job.companyName || "C")[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h2
              className={`text-5xl font-bold tracking-wide ${righteous.className}`}
            >
              {job.jobTitle || "Job Listing"}
            </h2>
            <h3 className="text-2xl md:text-3xl text-center md:flex md:items-center md:text-left gap-2 font-medium mt-4 tracking-wide">
              {job.companyName || "Company"}
            </h3>
            {job.role && (
              <Badge
                variant="secondary"
                className="mt-4 rounded-md text-sm px-3 py-1"
              >
                {job.role}
              </Badge>
            )}
            <p className="mt-4 text-sm dark:text-muted-foreground font-medium">
              Posted {job.created_at ? formatDistanceFromNow(job.created_at) : "recently"}
            </p>
          </div>
        </div>

        {/* Details Card */}
        <Card className="mb-8 border-primary">
          <CardContent className="p-6">
            <Keywords keywords={job.keywords} />
            <Separator className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                icon={Globe}
                label="Location"
                value={locationDetails}
              />
              <DetailItem
                icon={BriefcaseBusiness}
                label="Job Type"
                value={jobType}
              />
              <DetailItem
                icon={CircleDollarSign}
                label="Compensation Range"
                value={salaryRange}
              />
              <DetailItem
                icon={Wallet}
                label="Payment Method"
                value={paymentMethodDisplay}
              />
              <DetailItem
                icon={Handshake}
                label="Equity"
                value={equityRange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Job Description Section */}
        <section className="mb-8">
          <h3 className="text-xl flex items-center mb-4">
            <ScrollText className="w-6 h-6 mr-2 text-primary" />
            Job Description
          </h3>
          {/* Applied prose for basic styling, check if dark:prose-invert is needed */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80">
            <SafeHTMLContent html={job.jobDescription} />
          </div>
        </section>

        {/* Apply Button */}
        <Separator className="mb-6" />
        <div className="mb-4">
          <Button asChild className="w-full md:w-auto" size="lg">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={applyLink}
            >
              Apply Now
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}