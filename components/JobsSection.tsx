"use client";

import { useMemo, useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { SearchIcon, X, BriefcaseBusiness, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobCard from "./JobCard";
import { JobData } from "@/lib/types";

const JOBS_PER_PAGE = 20;

type Props = {
  jobs: JobData[];
  keywords: string[];
};

export default function JobsSection({ jobs, keywords }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllKeywords, setShowAllKeywords] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  const filteredJobs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return jobs.filter((job) => {
      const title = job.jobTitle ?? "";
      const jobKeywords = (job.keywords ?? "")
        .split(",")
        .map((k) => k.trim().toLowerCase());

      const matchesSearch =
        !term ||
        title.toLowerCase().includes(term) ||
        jobKeywords.some((k) => k.includes(term));
      const matchesCategory =
        selectedCategory === "all" || job.role === selectedCategory;
      const matchesRemote = !remoteOnly || job.jobLocation === "remote";
      const matchesKeyword =
        selectedKeyword === "All" ||
        jobKeywords.includes(selectedKeyword.toLowerCase());

      return matchesSearch && matchesCategory && matchesRemote && matchesKeyword;
    });
  }, [jobs, searchTerm, selectedCategory, remoteOnly, selectedKeyword]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, remoteOnly, selectedKeyword]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      id="availableJobs"
      aria-label="Available job listings"
      className="border-b-4 border-foreground"
    >
      {/* Section masthead */}
      <div className="border-b-4 border-foreground px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-baseline gap-4 flex-wrap">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CC0000] mb-1">
              ■ Listings
            </p>
            <h2 className="font-headline text-4xl sm:text-5xl font-black uppercase leading-none">
              Available Positions
            </h2>
          </div>
          <div className="ml-auto flex items-center gap-3 self-end pb-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {filteredJobs.length} {filteredJobs.length === 1 ? "role" : "roles"} found
            </span>
            {/* Remote toggle */}
            <label
              className={`flex items-center gap-2 cursor-pointer px-3 py-2 border-2 transition-all duration-200 font-mono text-[10px] uppercase tracking-widest select-none ${
                remoteOnly
                  ? "bg-[#CC0000] text-white border-[#CC0000]"
                  : "border-foreground hover:border-[#CC0000] hover:text-[#CC0000]"
              }`}
            >
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="sr-only"
                aria-label="Toggle remote only filter"
              />
              <span
                className={`inline-flex items-center justify-center w-3.5 h-3.5 border-2 flex-shrink-0 transition-all ${
                  remoteOnly ? "bg-white border-white" : "border-current"
                }`}
              >
                {remoteOnly && (
                  <span className="block w-1.5 h-1.5 bg-[#CC0000]" />
                )}
              </span>
              Remote Only
            </label>
          </div>
        </div>
      </div>

      {/* Search & filters */}
      <div className="border-b-2 border-foreground px-4 sm:px-6 lg:px-8 py-4 bg-secondary/40">
        <div className="max-w-7xl mx-auto">
          <form role="search" className="grid grid-cols-1 md:grid-cols-4 gap-0 border-2 border-foreground">
            {/* Search input */}
            <div className="relative md:col-span-3 border-b md:border-b-0 md:border-r border-foreground">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                name="search"
                placeholder="Search by title or keyword…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search jobs"
                className="w-full pl-9 pr-9 py-3 bg-transparent font-sans text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-secondary/30"
              />
              {!!searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#CC0000] transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category select */}
            <div className="relative flex items-center">
              <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory as Dispatch<SetStateAction<string>>}
              >
                <SelectTrigger className="border-0 pl-9 py-3 h-full w-full font-sans text-sm focus:ring-0 bg-transparent">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
      </div>

      {/* Keyword pills */}
      <div className="border-b-2 border-foreground px-4 sm:px-6 lg:px-8 py-3">
        <nav aria-label="Filter by keyword" className="max-w-7xl mx-auto">
          <div className="flex gap-2 items-start">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground shrink-0 mt-[5px] mr-1">
              Topics:
            </span>
            <div className="relative flex-1">
              <div
                className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${
                  showAllKeywords ? "max-h-[9999px]" : "max-h-[5.5rem]"
                }`}
              >
                {["All", ...keywords].map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setSelectedKeyword(kw)}
                    aria-pressed={kw === selectedKeyword}
                    className={`px-3 py-1 font-mono text-[10px] uppercase tracking-widest border transition-all duration-200 ${
                      kw === selectedKeyword
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground border-foreground hover:bg-foreground hover:text-background"
                    }`}
                  >
                    {kw}
                  </button>
                ))}
              </div>
              {!showAllKeywords && keywords.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              )}
            </div>
          </div>
          {keywords.length > 0 && (
            <button
              onClick={() => setShowAllKeywords((v) => !v)}
              className="mt-2 w-full flex items-center justify-center gap-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              {showAllKeywords ? (
                <>Show less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Show more <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </nav>
      </div>

      {/* Job listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredJobs.length === 0 ? (
          <div className="border-2 border-foreground py-16 text-center">
            <p className="font-headline text-2xl font-black uppercase">No Positions Found</p>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y-2 divide-foreground border-y-2 border-foreground">
              {paginatedJobs.map((job, idx) => (
                <JobCard key={job.id ?? idx} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t-2 border-foreground pt-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border border-foreground disabled:opacity-30 hover:bg-foreground hover:text-background transition-all disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={`w-8 h-8 font-mono text-[10px] uppercase tracking-widest border transition-all ${
                        page === currentPage
                          ? "bg-foreground text-background border-foreground"
                          : "border-foreground hover:bg-foreground hover:text-background"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border border-foreground disabled:opacity-30 hover:bg-foreground hover:text-background transition-all disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
