import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { JobData } from "@/lib/types";
import { formatDistanceFromNow, formatSalaryCurrency } from "@/lib/utils";
import { CalendarClock, CircleDollarSign } from "lucide-react";
import { Spline_Sans } from "next/font/google";
import { FaCrown, FaMapMarkerAlt, FaWifi } from "react-icons/fa";
import JobModal from "./JobModal";

const spline_sans_reg = Spline_Sans({ subsets: ["latin"], weight: "400" });
const spline_sans_bold = Spline_Sans({ subsets: ["latin"], weight: "500" });

export default function JobCard({
  job,
  hideFooter = false,
}: {
  job: JobData;
  hideFooter?: boolean;
}) {
  const getLocationIcon = () => {
    return job.jobLocation === "onsite" ? (
      <FaMapMarkerAlt
        className={`mr-1 ${
          job.featured ? "text-primary-foreground" : "text-primary"
        }`}
      />
    ) : (
      <FaWifi
        className={`mr-1 ${
          job.featured ? "text-primary-foreground" : "text-purple-500"
        }`}
      />
    );
  };

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
  
  // Check if job has any salary information
  const hasSalaryInfo = Boolean(job.minSalary || job.maxSalary);

  return (
    <Card
      className={`relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 ${
        job.featured
          ? "bg-gradient-to-r from-primary to-primary/60 dark:from-primary/65 dark:to-primary text-primary-foreground"
          : "bg-card border dark:border-primary"
      } hover:shadow-2xl dark:shadow-purple-950/20 hover:dark:shadow-purple-950`}
    >
      {job.featured && (
        <div className="absolute flex items-center gap-1 top-5 -right-7 bg-yellow-500 dark:bg-yellow-500 transform rotate-45 shadow-md z-10 text-xs font-semibold px-6 py-1 text-primary">
          <FaCrown className="animate-pulse" /> Featured
        </div>
      )}
      <CardContent className="p-6 relative pb-14 md:pb-6">
        <div className="flex flex-col md:flex-row md:items-start">
          <div className="mb-4 md:mb-0">
            <Avatar className="h-14 w-14 ring-2 ring-primary/10 dark:ring-primary">
              <AvatarImage src={job.companyLogo} alt={job.companyName} />
              <AvatarFallback>{job.companyName?.[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="md:ml-6 flex-1">
            <h2 className={`text-2xl ${spline_sans_bold.className}`}>
              {job.jobTitle}
            </h2>
            <p className={`text-lg tracking-wide ${spline_sans_reg.className}`}>
              {job.companyName}
            </p>

            {!hideFooter && (
              <p
                className={`text-sm md:hidden ${
                  job.featured
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                } capitalize mt-1`}
              >
                {formatDistanceFromNow(job.created_at)}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center text-sm gap-4">
              <span className="flex items-center">
                {getLocationIcon()}
                <span
                  className={`${
                    job.featured ? "text-primary-foreground" : "text-foreground"
                  } capitalize`}
                >
                  {job.jobLocation === "remote"
                    ? job.jobLocation
                    : job.locationDetails}
                </span>
              </span>
              <span className="flex items-center">
                <CalendarClock
                  className={`mr-1 w-4 h-4 ${
                    job.featured ? "text-primary-foreground" : "text-primary"
                  }`}
                />
                <span
                  className={
                    job.featured
                      ? "text-primary-foreground/90"
                      : "text-foreground"
                  }
                >
                  {getJobType()}
                </span>
              </span>
              {/* Only display salary info if it exists */}
              {hasSalaryInfo && (
                <span className="flex items-center">
                  <CircleDollarSign
                    className={`mr-1 w-4 h-4 ${
                      job.featured ? "text-primary-foreground" : "text-primary"
                    }`}
                  />
                  <span
                    className={
                      job.featured
                        ? "text-primary-foreground"
                        : "text-foreground"
                    }
                  >
                    {getSalaryRange()}
                  </span>
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.keywords?.split(",").map((keyword, index) => (
                <Badge
                  key={index}
                  variant={job.featured ? "outline" : "secondary"}
                  className={`rounded-sm px-3 py-1 text-xs font-medium ${
                    job.featured
                      ? "border-primary-foreground/30 text-primary-foreground"
                      : "bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary-foreground"
                  }`}
                >
                  {keyword.trim()}
                </Badge>
              ))}
            </div>
          </div>
          <div className="md:ml-4 flex items-center justify-end mt-4 md:mt-0 md:self-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={job.featured ? "secondary" : "default"}
                  className={`w-full sm:w-auto ${
                    job.featured
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  Preview
                </Button>
              </DialogTrigger>
              <JobModal job={job} hideFooter={hideFooter} />
            </Dialog>
          </div>
        </div>

        {!hideFooter && (
          <p
            className={`${
              spline_sans_reg.className
            } hidden md:block absolute bottom-6 right-6 text-sm ${
              job.featured ? "text-primary-foreground" : "text-muted-foreground"
            } capitalize`}
          >
            {formatDistanceFromNow(job.created_at)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}