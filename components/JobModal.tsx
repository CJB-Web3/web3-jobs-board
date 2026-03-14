"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import JobPreviewContent from "@/components/JobPreviewContent";
import { JobData } from "@/lib/types";
import Link from "next/link";

export default function JobModal({
  job,
  hideFooter = false,
}: {
  job: JobData;
  hideFooter?: boolean;
}) {
  return (
    <DialogContent className="lg:max-w-5xl md:max-w-3xl h-[85vh] w-full flex flex-col p-0 overflow-hidden bg-gradient-to-br from-background to-secondary/10">
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-grow">
          <div className="p-8">
            <DialogHeader className="sr-only">
              <DialogTitle>
                {job.jobTitle || "Job listing"} preview
              </DialogTitle>
            </DialogHeader>
            <JobPreviewContent job={job} showPostedAt={!hideFooter} />
          </div>
        </ScrollArea>
        {!hideFooter && (
          <>
            <div className="h-px bg-border mx-0 shrink-0" />
            <DialogFooter className="p-6 flex gap-2 md:flex-row md:justify-between bg-background/80 backdrop-blur-sm">
              <Button asChild variant="secondary">
                <Link href={`/job-details/${job.id}`}>View details</Link>
              </Button>
              <Button asChild>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={
                    job.applyMethod === "website"
                      ? job.applyWebsite || "#"
                      : `mailto:${job.applyEmail || ""}`
                  }
                >
                  Apply Now
                </a>
              </Button>
            </DialogFooter>
          </>
        )}
      </div>
    </DialogContent>
  );
}
