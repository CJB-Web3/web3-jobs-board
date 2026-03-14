"use client";

import { useMemo, useState, Dispatch, SetStateAction } from "react";
import { SearchIcon, X, BriefcaseBusiness } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobCard from "./JobCard";
import { JobData } from "@/lib/types";

type Props = {
  jobs: JobData[];
  keywords: string[];
};

export default function JobsSection({ jobs, keywords }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState("All");

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

  return (
    <section
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
            <label className="flex items-center gap-2 cursor-pointer border border-foreground px-3 py-1.5 transition-all duration-200 hover:bg-foreground hover:text-background group">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-3 h-3 accent-current"
                aria-label="Remote only"
              />
              <span className="font-mono text-[10px] uppercase tracking-widest">Remote Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Search & filters */}
      <div className="border-b-2 border-foreground px-4 sm:px-6 lg:px-8 py-4 bg-secondary/40">
        <div className="max-w-7xl mx-auto">
          <form role="search" className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-foreground">
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
      <nav
        aria-label="Filter by keyword"
        className="border-b-2 border-foreground px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-2"
      >
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground self-center mr-1">
          Topics:
        </span>
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
      </nav>

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
          <div className="divide-y-2 divide-foreground border-y-2 border-foreground">
            {filteredJobs.map((job, idx) => (
              <JobCard key={job.id ?? idx} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
