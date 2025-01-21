"use client";

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
import { Righteous } from "next/font/google";

const righteous = Righteous({ subsets: ["latin"], weight: "400" });

export default function JobDetails({ job }: { job: JobData }) {
  const getJobType = () => {
    if (job.fullTime) return "Full-time";
    if (job.partTime) return "Part-time";
    if (job.freelance) return "Freelance";
    if (job.internship) return "Internship";
    return "Not specified";
  };

  const getSalaryRange = () => {
    if (job.minSalary && job.maxSalary && job.salaryCurrency) {
      return `${formatSalaryCurrency(
        Number(job.minSalary),
        job.salaryCurrency
      )} 
         - ${formatSalaryCurrency(Number(job.maxSalary), job.salaryCurrency)}`;
    }
    return "Not specified";
  };

  const getEquityRange = () => {
    if (job.minEquity && job.maxEquity) {
      return `${job.minEquity} - ${job.maxEquity}%`;
    }
    return null;
  };

  const getLocationDetails = () => {
    if (job.jobLocation === "onsite") {
      return `On site - ${job.locationDetails}`;
    } else if (job.jobLocation === "remote") {
      if (job.remoteOption === "global") {
        return "Remote - Global";
      } else if (job.remoteOption === "geographic") {
        return `Remote - ${job.geographicRestrictions}`;
      } else if (job.remoteOption === "timezone") {
        return `Remote - ${job.timezoneRestrictions}`;
      }
    } else if (job.jobLocation === "hybrid") {
      if (job.remoteOption === "global") {
        return `On site or Remote - ${job.locationDetails}, Global`;
      } else if (job.remoteOption === "geographic") {
        return `On site or Remote - ${job.locationDetails}, ${job.geographicRestrictions}`;
      } else if (job.remoteOption === "timezone") {
        return `On site or Remote - ${job.locationDetails}, ${job.timezoneRestrictions}`;
      }
    }
    return "Not specified";
  };

  const equityRange = getEquityRange();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={job.companyLogo} alt={job.companyName} />
            <AvatarFallback>{job.companyName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h2
              className={`text-5xl font-bold tracking-wide ${righteous.className}`}
            >
              {job.jobTitle}
            </h2>

            <h3 className="text-2xl md:text-3xl text-center md:flex md:items-center md:text-left gap-2 font-medium mt-4 tracking-wide">
              {job.companyName}
            </h3>
            <Badge
              variant="secondary"
              className="mt-4 rounded-md text-sm px-3 py-1"
            >
              {job.role}
            </Badge>

            <p className="mt-4 text-sm dark:text-muted-foreground font-medium">
              Posted {formatDistanceFromNow(job.created_at)}
            </p>
          </div>
        </div>

        <Card className="mb-8 border-primary">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {job.keywords?.split(",").map((keyword, index) => (
                <Badge className="rounded-sm text-sm" key={index}>
                  {keyword.trim()}
                </Badge>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Location
                  </p>
                </div>
                <span className="text-base">{getLocationDetails()}</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness className="w-5 h-5 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Job Type
                  </p>
                </div>
                <span className="text-base">{getJobType()}</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="w-5 h-5 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Compensation Range
                  </p>
                </div>
                <span className="text-base">{getSalaryRange()}</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Payment Method
                  </p>
                </div>
                <span className="text-base">{job.paymentMethod}</span>
              </div>

              {equityRange && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Handshake className="w-5 h-5 text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Equity
                    </p>
                  </div>
                  <span className="text-base">{equityRange}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <section className="mb-8">
          <h3 className="text-xl flex items-center mb-4">
            <ScrollText className="w-6 h-6 mr-2 text-primary" />
            Job Description
          </h3>
          <div
            className="prose prose-sm max-w-none text-foreground/80"
            dangerouslySetInnerHTML={{ __html: job.jobDescription as string }}
          />
        </section>

        <Separator className="mb-6" />
        <div className="mb-4">
          <Button asChild className="w-full md:w-auto" size="lg">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                job.applyMethod === "website"
                  ? job.applyWebsite || "#"
                  : `mailto:${job.applyEmail}`
              }
            >
              Apply Now
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}