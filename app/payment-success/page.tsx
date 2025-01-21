import JobCard from "@/components/JobCard";
import SpinnerJobs from "@/components/SpinnerJobs";
import { Button } from "@/components/ui/button";
import { getJob } from "@/lib/actions";
import { stripe } from "@/lib/stripe";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent: string }>;
}) {
  const paymentIntentId = (await searchParams).payment_intent;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const jobId = paymentIntent.metadata.jobId;

  const isSuccess = paymentIntent.status === "succeeded";

  if (jobId === null) return notFound();

  const job = await getJob(Number(jobId));

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-8 mt-48 mb-20">
      <h1 className="text-4xl font-bold text-center mb-4">
        {isSuccess
          ? "Thank you. Your Job has been posted successfully."
          : "Sorry, failed to post the job."}
      </h1>

      <Suspense fallback={<SpinnerJobs />}>
        {isSuccess && job && (
          <>
            <p className="text-center text-sm text-muted-foreground mb-8">
              Please go to jobs page to see the posted job
            </p>

            <div className="max-w-4xl mx-auto">
              <JobCard job={job} />
            </div>
          </>
        )}
      </Suspense>

      <div className="flex justify-center mt-6">
        <Button size={"lg"} asChild>
          <Link href="/">
            Go to Home <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
