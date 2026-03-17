"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { Menu, X } from "lucide-react";
import { Audiowide } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const audiowide = Audiowide({ subsets: ["latin"], weight: "400" });

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleJobsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById("availableJobs")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  function handleRedirect(link: string) {
    setIsOpen(false);
    router.push(link);
  }

  return (
    <header className="fixed top-0 z-50 w-full bg-background border-b-4 border-foreground">
      {/* Edition bar */}
      <div className="border-b border-foreground/20 px-4 sm:px-6 lg:px-8 hidden md:flex justify-between items-center h-7">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Est. 2024 · The Web3 Employment Record
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Main nav row */}
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-2 group" aria-label="Web3 Jobs Board Home" title="Web3 Jobs Board Home">
            <span className={`${audiowide.className} font-extrabold tracking-wider text-3xl`}>
              WJB
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0 divide-x divide-foreground border-l border-foreground">
            <Link
              href="/#availableJobs"
              onClick={handleJobsClick}
              aria-label="Browse Available Web3 Jobs"
              title="Browse Web3 Jobs"
              className="px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest transition-all duration-200 hover:bg-foreground hover:text-background"
            >
              Jobs
            </Link>
            <Link
              href="/companies"
              aria-label="View Web3 Companies"
              title="Web3 Companies"
              className="px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest transition-all duration-200 hover:bg-foreground hover:text-background"
            >
              Companies
            </Link>
            <Link
              href="/pricing"
              aria-label="View Pricing Plans"
              title="Pricing"
              className="px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest transition-all duration-200 hover:bg-foreground hover:text-background"
            >
              Pricing
            </Link>
            <Link
              href="/post-job"
              aria-label="Post a Web3 Job"
              title="Post a Job"
              className="px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest bg-foreground text-background transition-all duration-200 hover:bg-[#CC0000] hover:text-white"
            >
              Post a Job
            </Link>
            <div className="px-3 py-2 border-l border-foreground">
              <ModeToggle />
            </div>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-3">
            <ModeToggle />
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="p-2 border border-foreground transition-all duration-200 hover:bg-foreground hover:text-background"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t-2 border-foreground bg-background animate-fade-in-down">
          <div className="divide-y divide-foreground/20">
            <button
              onClick={() => handleRedirect("/#availableJobs")}
              className="w-full text-left px-6 py-4 font-sans text-sm font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-200"
            >
              Find Jobs
            </button>
            <button
              onClick={() => handleRedirect("/companies")}
              className="w-full text-left px-6 py-4 font-sans text-sm font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-200"
            >
              Companies
            </button>
            <button
              onClick={() => handleRedirect("/pricing")}
              className="w-full text-left px-6 py-4 font-sans text-sm font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-200"
            >
              Pricing
            </button>
            <button
              onClick={() => handleRedirect("/post-job")}
              className="w-full text-left px-6 py-4 font-sans text-sm font-semibold uppercase tracking-widest bg-foreground text-background"
            >
              Post a Job →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
