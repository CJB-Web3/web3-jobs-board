import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import Link from "next/link";
import ReactHtmlParser from "react-html-parser";

const righteous_font = Righteous({ subsets: ["latin"], weight: "400" });

function JobModal({
  job,
  hideFooter = false,
}: {
  job: JobData;
  hideFooter?: boolean;
}) {
  // Helper function to get job type
  const getJobType = () => {
    if (job.fullTime) return "Full-time";
    if (job.partTime) return "Part-time";
    if (job.freelance) return "Freelance";
    if (job.internship) return "Internship";
    return "Not specified";
  };

  // Helper function to get salary range
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

  // Helper function to get equity range
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
    return "";
  };

  const equityRange = getEquityRange();

  return (
    <DialogContent className="lg:max-w-5xl md:max-w-3xl h-[85vh] w-full flex flex-col p-0 overflow-hidden bg-gradient-to-br from-background to-secondary/10">
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-grow">
          <div className="p-8">
            <DialogHeader className="text-left">
              <div className="flex mb-6">
                <Avatar className="h-20 w-20 mr-6 border-2 border-primary">
                  <AvatarImage src={job.companyLogo} alt={job.companyName} />
                  <AvatarFallback>{job.companyName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2
                    className={`text-4xl text-foreground ${righteous_font.className}`}
                  >
                    {job.companyName}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="mt-2 rounded-md text-sm font-semibold px-3 py-1"
                  >
                    {job.role}
                  </Badge>

                  {!hideFooter && (
                    <p className="mt-4 text-sm dark:text-muted-foreground">
                      Posted {formatDistanceFromNow(job.created_at)}
                    </p>
                  )}
                </div>
              </div>

              <DialogTitle
                className={`text-xl md:text-2xl flex items-center gap-3 font-medium mb-4`}
              >
                <span> Role - {job.jobTitle}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-wrap gap-2 mt-4">
              {job.keywords?.split(",").map((keyword, index) => (
                <Badge className="rounded-sm" key={index}>
                  {keyword.trim()}
                </Badge>
              ))}
            </div>

            <div className="mt-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <Globe className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>

                  <span className="text-base text-foreground">
                    {getLocationDetails()}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <BriefcaseBusiness className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Job Type</p>
                  </div>

                  <span className="text-base text-foreground">
                    {getJobType()}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <CircleDollarSign className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Compensation Range
                    </p>
                  </div>

                  <span className="text-base text-foreground">
                    {getSalaryRange()}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <Wallet className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Payment Method
                    </p>
                  </div>

                  <span className="text-base text-foreground">
                    {job.paymentMethod}
                  </span>
                </div>

                {equityRange && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <Handshake className="w-5 h-5 text-primary" />
                      <p className="text-sm text-muted-foreground">Equity</p>
                    </div>

                    <span className="text-base text-foreground">
                      {equityRange}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 mt-8">
              <h3 className={`text-lg flex items-center`}>
                <ScrollText className="w-6 h-6 mr-2 text-primary" />
                Job Description
              </h3>
              <div className="whitespace-pre-wrap text-muted-foreground text-lg leading-relaxed">
                {ReactHtmlParser(job.jobDescription as string)}
              </div>
            </div>
          </div>
        </ScrollArea>

        {!hideFooter && (
          <DialogFooter className="p-6 border-t flex gap-2 md:flex-row md:justify-between bg-background/80 backdrop-blur-sm">
            <Button asChild variant={"secondary"}>
              <Link href={`/job-details/${job.id}`}>View details</Link>
            </Button>

            <Button asChild>
              <a
                target="_blank"
                href={
                  job.applyMethod === "website"
                    ? job.applyWebsite || "#"
                    : `mailto:${job.applyEmail}`
                }
              >
                Apply Now
              </a>
            </Button>
          </DialogFooter>
        )}
      </div>
    </DialogContent>
  );
}

export default JobModal;