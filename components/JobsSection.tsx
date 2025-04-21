"use client";

import { useMemo, useState, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, BriefcaseBusiness, SearchIcon, X } from "lucide-react";
import JobCard from "./JobCard";
import { Button } from "./ui/button";
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

      return (
        matchesSearch && matchesCategory && matchesRemote && matchesKeyword
      );
    });
  }, [jobs, searchTerm, selectedCategory, remoteOnly, selectedKeyword]);

  return (
    <section
      id="availableJobs"
      aria-label="Available job listings"
      className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Search & Filters */}
      <div className="shadow-lg rounded-xl border p-6">
        <form role="search" className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative md:col-span-3">
            <Input
              type="search"
              name="search"
              placeholder="Search jobs by title or keywords…"
              className="px-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search jobs"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
            {!!searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <Label htmlFor="category-select" className="sr-only">
              Filter by category
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory as Dispatch<SetStateAction<string>>}
              aria-label="Filter by category"
            >
              {/* Move id here for accessibility */}
              <SelectTrigger
                id="category-select"
                className="w-full pl-10 pr-4"
              >
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
            <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
          </div>
        </form>
      </div>

      {/* Keyword Pills */}
      <nav
        aria-label="Filter by keyword"
        className="flex flex-wrap justify-center gap-2 mt-6 mb-10"
      >
        {["All", ...keywords].map((kw) => (
          <Button
            key={kw}
            variant="secondary"
            className={
              kw === selectedKeyword
                ? "bg-primary/90 text-slate-50 hover:bg-primary/90 dark:bg-purple-500 dark:hover:bg-purple-500"
                : ""
            }
            onClick={() => setSelectedKeyword(kw)}
            aria-pressed={kw === selectedKeyword}
          >
            {kw}
          </Button>
        ))}
      </nav>

      {/* Results Header */}
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-primary">
          <Bell className="h-5 w-5" />
          <p className="font-medium">
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "job" : "jobs"} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="remote-only">Remote Only</Label>
          <Switch
            id="remote-only"
            checked={remoteOnly}
            onCheckedChange={setRemoteOnly}
            aria-label="Toggle remote only jobs"
          />
        </div>
      </header>

      {/* Job Cards */}
      {filteredJobs.length === 0 ? (
        <p className="text-center py-10 text-xl font-medium text-gray-700">
          No matching jobs found.
        </p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {filteredJobs.map((job, idx) => (
            <JobCard key={job.id ?? idx} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}
