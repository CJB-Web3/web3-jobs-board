import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { JobData } from "@/lib/types";
import { formatDistanceFromNow, formatSalaryCurrency, slugify } from "@/lib/utils";
import { CalendarClock, CircleDollarSign, MapPin, Wifi } from "lucide-react";
import JobModal from "./JobModal";
import Link from "next/link";
import Image from "next/image";

export default function JobCard({
  job,
  hideFooter = false,
}: {
  job: JobData;
  hideFooter?: boolean;
}) {
  const getJobType = () => {
    if (job.fullTime) return "Full-time";
    if (job.partTime) return "Part-time";
    if (job.freelance) return "Freelance";
    if (job.internship) return "Internship";
    return "Not specified";
  };

  const getSalaryRange = () => {
    if (job.minSalary && job.maxSalary && job.salaryCurrency) {
      return `${formatSalaryCurrency(Number(job.minSalary), job.salaryCurrency)} – ${formatSalaryCurrency(Number(job.maxSalary), job.salaryCurrency)}`;
    }
    return null;
  };

  const hasSalaryInfo = Boolean(job.minSalary || job.maxSalary);
  const salaryRange = getSalaryRange();
  const isRemote = job.jobLocation === "remote";

  if (job.featured) {
    return (
      <article className="group relative flex transition-all duration-200 bg-[#FFFDF8] dark:bg-[#180505] shadow-[0_4px_28px_rgba(204,0,0,0.09)] dark:shadow-[0_4px_28px_rgba(204,0,0,0.25)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#CC0000]">

        {/* Left ribbon */}
        <div className="flex-shrink-0 w-9 sm:w-10 bg-[#CC0000] flex items-center justify-center">
          <span
            className="font-sans text-[7px] font-bold uppercase tracking-[0.55em] text-white select-none whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            ★ Featured
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-7 py-6 sm:py-7">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">

            {/* Logo */}
            <div className="flex-shrink-0">
              <Avatar className="h-16 w-16">
                {job.companyLogo ? (
                  <Image
                    src={job.companyLogo}
                    alt={`${job.companyName} logo`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="font-headline font-black text-xl bg-[#CC0000] text-white">
                    {job.companyName?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">

              {/* Role label */}
              {job.role && (
                <p className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#CC0000] dark:text-[#ff6666] mb-1.5">
                  {job.role}
                </p>
              )}

              {/* Title */}
              <h3 className="font-headline text-3xl sm:text-4xl font-black leading-tight uppercase mb-1 text-foreground transition-all duration-200 group-hover:underline decoration-2 underline-offset-2">
                <Link href={`/job-details/${job.id}-${slugify(job.jobTitle || "")}`} className="hover:text-[#CC0000] focus:outline-none focus:ring-2 focus:ring-[#CC0000] focus:ring-offset-2">
                  {job.jobTitle}
                </Link>
              </h3>

              {/* Company */}
              <p className="font-sans text-base font-bold mb-3 text-foreground hover:underline">
                <Link href={`/companies/${encodeURIComponent(job.companyName?.replaceAll(" ", "_") || "")}`}>
                  {job.companyName}
                </Link>
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm font-sans text-foreground/75 mb-4">
                <span className="flex items-center gap-1.5">
                  {isRemote ? <Wifi className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  {isRemote ? "Remote" : job.locationDetails}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5" />
                  {getJobType()}
                </span>
                {hasSalaryInfo && salaryRange && (
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <CircleDollarSign className="w-3.5 h-3.5" />
                    {salaryRange}
                  </span>
                )}
                {!hideFooter && (
                  <span className="text-foreground/40">
                    {formatDistanceFromNow(job.created_at)}
                  </span>
                )}
              </div>

              {/* Keywords */}
              {job.keywords && (
                <div className="flex flex-wrap gap-1.5">
                  {job.keywords.split(",").map((kw, i) => (
                    <span
                      key={i}
                      className="font-sans text-[9px] uppercase tracking-widest px-2 py-0.5 bg-[#CC0000]/10 dark:bg-[#CC0000]/30 border border-[#CC0000]/40 dark:border-[#CC0000]/70 text-[#CC0000] dark:text-[#ff6666]"
                    >
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex-shrink-0 self-start sm:self-center">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="font-sans text-[10px] font-bold uppercase tracking-widest px-5 py-3 bg-[#CC0000] text-white border border-[#CC0000] transition-all duration-200 hover:bg-transparent hover:text-[#CC0000] dark:hover:bg-[#CC0000]/20 dark:hover:text-[#ff6666] dark:hover:border-[#ff6666]">
                    Preview
                  </button>
                </DialogTrigger>
                <JobModal job={job} hideFooter={hideFooter} />
              </Dialog>
            </div>

          </div>
        </div>
      </article>
    );
  }

  // ── Regular card ─────────────────────────────────────
  return (
    <article className="group relative transition-all duration-200 bg-background hover:bg-secondary/50 hover:shadow-[inset_4px_0_0_0_hsl(var(--foreground))]">
      <div className="px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">

          {/* Logo */}
          <div className="flex-shrink-0">
              <Avatar className="h-12 w-12">
                {job.companyLogo ? (
                  <Image
                    src={job.companyLogo}
                    alt={`${job.companyName} logo`}
                    fill
                    sizes="48px"
                    className="object-cover transition-all duration-300"
                  />
                ) : (
                  <AvatarFallback className="font-headline font-black text-lg bg-secondary text-foreground">
                    {job.companyName?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {job.role && (
              <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                {job.role}
              </p>
            )}

            <h3 className="font-headline text-2xl sm:text-3xl font-black leading-tight uppercase mb-1 text-foreground transition-all duration-200 group-hover:underline decoration-2 underline-offset-2">
              <Link href={`/job-details/${job.id}-${slugify(job.jobTitle || "")}`} className="hover:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2">
                {job.jobTitle}
              </Link>
            </h3>

            <p className="font-sans text-base font-semibold mb-3 text-foreground/80 hover:underline">
              <Link href={`/companies/${encodeURIComponent(job.companyName?.replaceAll(" ", "_") || "")}`}>
                {job.companyName}
              </Link>
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm font-sans text-foreground/70 mb-3">
              <span className="flex items-center gap-1.5">
                {isRemote ? <Wifi className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                {isRemote ? "Remote" : job.locationDetails}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5" />
                {getJobType()}
              </span>
              {hasSalaryInfo && salaryRange && (
                <span className="flex items-center gap-1.5">
                  <CircleDollarSign className="w-3.5 h-3.5" />
                  {salaryRange}
                </span>
              )}
              {!hideFooter && (
                <span className="text-foreground/45">
                  {formatDistanceFromNow(job.created_at)}
                </span>
              )}
            </div>

            {job.keywords && (
              <div className="flex flex-wrap gap-1.5">
                {job.keywords.split(",").map((kw, i) => (
                  <span
                    key={i}
                    className="font-sans text-[9px] uppercase tracking-widest px-2 py-0.5 border border-foreground/30 text-foreground/55 transition-colors duration-200 group-hover:border-foreground/60 group-hover:text-foreground/75"
                  >
                    {kw.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex-shrink-0 self-start sm:self-center">
            <Dialog>
              <DialogTrigger asChild>
                <button className="font-sans text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 border border-foreground text-foreground transition-all duration-200 hover:bg-foreground hover:text-background">
                  Preview
                </button>
              </DialogTrigger>
              <JobModal job={job} hideFooter={hideFooter} />
            </Dialog>
          </div>

        </div>
      </div>
    </article>
  );
}
