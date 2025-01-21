import { Button } from "@/components/ui/button";
import { Anta, Spline_Sans } from "next/font/google";
import Link from "next/link";
import HeroBackground from "./HeroBackground";
import SmoothScrollToSection from "./SmoothScrollToSection";

const anta_font = Anta({ subsets: ["latin"], weight: "400" });
const spline_sans_font = Spline_Sans({ subsets: ["latin"], weight: "400" });
export default function HeroSection() {
  return (
    <HeroBackground>
      <div className="max-w-7xl mt-24 mb-22 mx-auto px-4 py-16 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          <div
            className={`flex flex-col gap-7 text-4xl font-semibold text-accent-foreground sm:text-5xl md:text-7xl animate-slide-in-top ${anta_font.className}`}
          >
            <h1>Finding The Right Talent</h1>
            <h1 className="dark:bg-gradient-to-br dark:from-indigo-500 dark:via-purple-500 dark:to-pink-400 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Made Simple
            </h1>
          </div>
          <h2
            className={`mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-lg md:max-w-3xl animate-slide-in-top ${spline_sans_font.className}`}
          >
            Helping the best companies connect with the best talents in the
            industry.
          </h2>
          <div className="mt-10 max-w-md mx-auto sm:flex-row sm:justify-center flex flex-col gap-6">
            <Button
              asChild
              className="px-10 py-4 bg-primary hover:violet-600 dark:bg-purple-600 text-white transition-all duration-300 ease-in-out dark:hover:bg-purple-400 hover:shadow-lg hover:shadow-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-95"
            >
              <Link href="/post-job">Post a Job</Link>
            </Button>
            <SmoothScrollToSection href="#availableJobs">
              <Button
                asChild
                variant="outline"
                className="px-10 py-4 duration-300 transition-all shadow-lg border dark:border-primary hover:shadow-lg hover:shadow-purple-400/50"
              >
                <Link href="#availableJobs">Find Jobs &darr;</Link>
              </Button>
            </SmoothScrollToSection>
          </div>
        </div>
      </div>
    </HeroBackground>
  );
}
