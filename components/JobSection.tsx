"use client";

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
import { JobData } from "@/lib/types";
import { Bell, BriefcaseBusiness, SearchIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import JobCard from "./JobCard";
import { Button } from "./ui/button";

type Props = {
  jobs: JobData[];
  keywords: string[];
};

function JobsSection({ jobs, keywords }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState("All");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Get job keywords as an array
      const jobKeywords = (job.keywords as string)
        .split(",")
        .map((keyword) => keyword.trim().toLowerCase());

      // Check if search term matches job title or any keyword
      const matchesSearch =
        searchTerm === "" ||
        job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobKeywords.some((keyword) => 
          keyword.includes(searchTerm.toLowerCase())
        );

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

  const noMatchingJobs = filteredJobs.length === 0;

  return (
    <div
      className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8"
      id="availableJobs"
    >
      <div className="shadow-lg rounded-xl border p-6">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative md:col-span-3">
              <Input
                type="text"
                placeholder="Search jobs by title or keywords..."
                className="px-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
              {searchTerm.length > 0 && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400 hover:transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="relative">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full pl-10 pr-4">
                  <SelectValue placeholder="Select a category" />
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
              <BriefcaseBusiness className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <>
        <div className="flex flex-wrap justify-center gap-2 mt-6 mb-10">
          {["All", ...keywords].map((keyword) => (
            <Button
              variant={"secondary"}
              key={keyword}
              className={`${
                keyword === selectedKeyword
                  ? "bg-primary/90 hover:bg-primary/90 dark:bg-purple-500 dark:hover:bg-purple-500 text-slate-50"
                  : ""
              }`}
              onClick={() => setSelectedKeyword(keyword)}
            >
              {keyword}
            </Button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-4 py-2">
              <Bell className="w-5 h-5" />
              <span className="font-medium">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} found
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <Label htmlFor="remote-check">Remote Only</Label>
              <Switch
                id="remote-check"
                checked={remoteOnly}
                onCheckedChange={setRemoteOnly}
              />
            </div>
          </div>

          {noMatchingJobs ? (
            <div className="text-center py-10">
              <p className="text-xl font-lg text-gray-700">
                No matching jobs found
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job, idx) => (
                <JobCard key={job.id || idx} job={job} />
              ))}
            </div>
          )}
        </div>
      </>
    </div>
  );
}

export default JobsSection;