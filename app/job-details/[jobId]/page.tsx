import JobDetails from "@/components/JobDetails";
import { getJobById } from "@/lib/actions";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = await getJobById(Number(jobId));

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-8 mt-36 mb-20">
      {job ? (
        <JobDetails job={job} />
      ) : (
        <p className="text-center text-2xl font-bold text-foreground">
          Job not found
        </p>
      )}
    </main>
  );
}
