import CompanyCard from "@/components/CompanyCard";
import Spinner from "@/components/Spinner";
import { getCompanies } from "@/lib/actions";
import { Righteous } from "next/font/google";
import { Suspense } from "react";

const righteous_font = Righteous({ subsets: ["latin"], weight: "400" });

async function Page() {
  const companies = await getCompanies();

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-8 mt-36 mb-20">
      <div className="space-y-4 mb-10">
        <h1
          className={`font-bold text-primary text-4xl ${righteous_font.className}`}
        >
          Featured crypto startups
        </h1>
        <p className="text-lg text-muted-foreground font-normal">
          Explore innovative companies shaping the future of blockchain and
          cryptocurrency. These trailblazers are not only transforming
          industries but also offering exciting career opportunities. Discover
          your next role with visionary startups redefining the digital
          landscape.
        </p>
      </div>

      <Suspense fallback={<Spinner />}>
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-6">
          {companies?.map((company, id) => (
            <CompanyCard key={id} companyInfo={company} />
          ))}
        </div>
      </Suspense>
    </main>
  );
}

export default Page;
