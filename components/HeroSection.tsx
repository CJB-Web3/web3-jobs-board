import Link from "next/link";
import SmoothScrollToSection from "./SmoothScrollToSection";
import CompanySlider from "./CompanySlider";

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="border-b-4 border-foreground mt-[3.75rem] md:mt-[5.5rem]"
    >
      {/* Masthead */}
      <div className="border-b-2 border-foreground px-4 sm:px-6 lg:px-8 py-5 text-center">
        <h1 className="font-headline text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase">
          Web3 Jobs Board
        </h1>
        <div className="flex items-center gap-4 mt-6 justify-center">
          <span className="h-px flex-1 max-w-24 bg-foreground" />
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            The Definitive Record of Decentralized Employment
          </p>
          <span className="h-px flex-1 max-w-24 bg-foreground" />
        </div>
      </div>

      {/* Editorial body — two column on large screens */}
      <div className="flex flex-col lg:flex-row">

        {/* Left: text + CTAs */}
        <div className="lg:w-7/12 px-4 sm:px-6 lg:px-8 py-10 lg:border-r lg:border-foreground">
          {/* Section label */}
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#CC0000] mb-3">
            ■ Careers &amp; Opportunities
          </p>

          {/* Lead headline */}
          <h2 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black leading-tight uppercase mb-4">
            Hiring The Right Talent Made Simple
          </h2>

          <div className="w-full h-px bg-foreground mb-4" />

          {/* Drop-cap body */}
          <p className="drop-cap font-body text-base leading-relaxed mb-4">
            Build the decentralized future: find your dream role and kickstart your
            crypto career. From DeFi protocols to NFT platforms, the next generation
            of the internet is hiring today.
          </p>

          <p className="font-body text-base leading-relaxed mb-8 text-muted-foreground">
            Whether you are an engineer building the infrastructure of tomorrow,
            a designer shaping on-chain experiences, or a marketer rallying
            communities — Web3 employers are looking for talent like yours.
          </p>

          {/* CTA buttons */}
          <nav
            aria-label="Primary calls to action"
            className="flex flex-wrap gap-0 border border-foreground w-fit"
          >
            <Link
              href="/post-job"
              className="px-6 py-3 font-sans text-sm font-bold uppercase tracking-widest bg-foreground text-background transition-all duration-200 hover:bg-[#CC0000]"
            >
              Post a Job
            </Link>
            <SmoothScrollToSection href="#availableJobs">
              <Link
                href="#availableJobs"
                className="px-6 py-3 font-sans text-sm font-bold uppercase tracking-widest bg-background text-foreground border-l border-foreground transition-all duration-200 hover:bg-foreground hover:text-background"
              >
                Find Jobs ↓
              </Link>
            </SmoothScrollToSection>
          </nav>
        </div>

        {/* Right: logo carousels */}
        <div className="lg:w-5/12 flex flex-col justify-center overflow-hidden border-t border-foreground lg:border-t-0">
          <CompanySlider />
        </div>

      </div>
    </section>
  );
}
