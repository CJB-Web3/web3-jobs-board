import HeroSection from "@/components/HeroSection";
import JobsSection from "@/components/JobSection";
import SpinnerJobs from "@/components/SpinnerJobs";
import { getJobKeywords, getJobListings } from "@/lib/actions";
import { Suspense } from "react";

async function Page() {
  const [jobs, keywords] = await Promise.all([
    getJobListings(),
    getJobKeywords(),
  ]);

  return (
    <main>
      <HeroSection />
      {/* <CompanySlider /> */}
      <Suspense fallback={<SpinnerJobs />}>
        <JobsSection jobs={jobs} keywords={keywords} />
      </Suspense>
    </main>
  );
}

export default Page;
