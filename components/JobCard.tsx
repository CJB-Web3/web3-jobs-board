import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { JobData } from "@/lib/types";
import { formatDistanceFromNow, formatSalaryCurrency } from "@/lib/utils";
import { CalendarClock, CircleDollarSign, MapPin, Wifi } from "lucide-react";
import JobModal from "./JobModal";

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
      <article className="group relative transition-all duration-200 bg-[#FFFAF9] dark:bg-[#1c0808] border-l-4 border-l-[#CC0000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#CC0000]">

        {/* Red header stripe */}
        <div className="bg-[#CC0000] px-4 sm:px-6 lg:px-8 py-1.5 flex items-center gap-3">
          <span className="font-sans text-[9px] font-bold uppercase tracking-[0.35em] text-white">
            ★ Featured Listing
          </span>
          <span className="h-px flex-1 bg-white/25" />
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-white/60">
            Sponsored
          </span>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">

            {/* Logo — larger, always full colour */}
            <div className="flex-shrink-0">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={job.companyLogo || undefined}
                  alt={job.companyName}
                />
                <AvatarFallback className="font-headline font-black text-xl bg-[#CC0000] text-white">
                  {job.companyName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">

              {/* Role label — in red */}
              {job.role && (
                <p className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#CC0000] dark:text-[#ff6666] mb-1">
                  {job.role}
                </p>
              )}

              {/* Title */}
              <h3 className="font-headline text-3xl sm:text-4xl font-black leading-tight uppercase mb-1 text-foreground transition-all duration-200 group-hover:underline decoration-2 underline-offset-2">
                {job.jobTitle}
              </h3>

              {/* Company */}
              <p className="font-sans text-base font-bold mb-3 text-foreground">
                {job.companyName}
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
                <AvatarImage
                  src={job.companyLogo || undefined}
                  alt={job.companyName}
                  className="grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              <AvatarFallback className="font-headline font-black text-lg bg-secondary text-foreground">
                {job.companyName?.[0]}
              </AvatarFallback>
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
              {job.jobTitle}
            </h3>

            <p className="font-sans text-base font-semibold mb-3 text-foreground/80">
              {job.companyName}
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
