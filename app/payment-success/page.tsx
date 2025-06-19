import JobCard from "@/components/JobCard";
import SpinnerJobs from "@/components/SpinnerJobs";
import { Button } from "@/components/ui/button";
import { getJob } from "@/lib/actions";
import { ChevronRight, ExternalLink, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ job_id?: string; tx_hash?: string }>;
}) {
  const params = await searchParams;
  const jobId = params.job_id;
  const txHash = params.tx_hash;

  if (!jobId) return notFound();

  const job = await getJob(Number(jobId));

  if (!job) return notFound();

  const isSuccess = job.paymentStatus === "paid";

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-8 mt-32 mb-20">
      <div className="text-center mb-12">
        {isSuccess && (
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        )}
        
        <h1 className="text-4xl font-bold mb-4">
          {isSuccess
            ? "Payment Successful!"
            : "Payment Processing..."}
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isSuccess
            ? "Thank you! Your job has been posted successfully and is now live on our platform."
            : "Your payment is being processed. Please check back in a few moments."}
        </p>
      </div>

      <Suspense fallback={<SpinnerJobs />}>
        {isSuccess && job && (
          <>
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6">
                <h2 className="text-lg font-semibold mb-4">Transaction Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Job ID</span>
                    <span className="font-mono text-sm">#{job.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Plan Type</span>
                    <span className="font-medium">{job.featured ? "Featured" : "Basic"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount Paid</span>
                    <span className="font-medium">${job.featured ? "150" : "80"} USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                    <span className="font-medium">Cryptocurrency</span>
                  </div>
                  {txHash && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Transaction Hash</span>
                      <span className="font-mono text-sm">
                        {txHash.slice(0, 10)}...{txHash.slice(-8)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your Posted Job</h3>
                <JobCard job={job} />
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Your job is now live and visible to thousands of job seekers</li>
                  <li>• You'll receive applications via the method you specified</li>
                  <li>• Your listing will remain active for 30 days</li>
                  <li>• You can post another job anytime from the homepage</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </Suspense>

      <div className="flex justify-center gap-4 mt-12">
        <Button size="lg" asChild>
          <Link href="/">
            Go to Home <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/jobs">
            View All Jobs <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </main>
  );
}