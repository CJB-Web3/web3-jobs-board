"use client";

import { Linkedin, Mail, Send } from "lucide-react";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Top rule */}
      <div className="border-b-4 border-background/20 px-4 sm:px-6 lg:px-8 py-5 flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-background/50 mb-1">
            Est. 2024
          </p>
          <Link href="/" aria-label="Web3 Jobs Board Home" title="Web3 Jobs Board Home" className="font-headline text-4xl font-black tracking-tight uppercase">
            WJB
          </Link>
        </div>
        <p className="font-body text-sm italic text-background/70 max-w-xs">
          &ldquo;Shaping the Future of Decentralized Work.&rdquo;
        </p>
      </div>

      {/* Main grid — newspaper columns */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-background/20">

          {/* About — 4 cols */}
          <div className="lg:col-span-4 pb-6 sm:pb-0 sm:pr-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-background/50 mb-3">
              About
            </p>
            <p className="font-body text-sm leading-relaxed text-background/70">
              Web3 Jobs Board connects talent with the most promising
              opportunities in the decentralized economy. From protocol
              engineering to community marketing, we cover the full spectrum
              of blockchain careers.
            </p>
          </div>

          {/* Quick links — 3 cols */}
          <div className="lg:col-span-3 pt-6 sm:pt-0 sm:px-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-background/50 mb-3">
              Quick Links
            </p>
            <nav className="space-y-2">
              {[
                { label: "Browse Jobs", href: "/#availableJobs", title: "Browse Web3 Jobs" },
                { label: "Post a Job", href: "/post-job", title: "Post a Job" },
                { label: "Companies", href: "/companies", title: "Web3 Companies" },
                { label: "Pricing", href: "/pricing", title: "Pricing" },
              ].map(({ label, href, title }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={title}
                  title={title}
                  className="block font-sans text-sm text-background/70 hover:text-[#CC0000] transition-colors duration-200 group"
                >
                  <span className="inline-block w-3 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  {" "}{label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect — 2 cols */}
          <div className="lg:col-span-2 pt-6 sm:pt-0 sm:px-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-background/50 mb-3">
              Connect
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: FaXTwitter, label: "Twitter" },
                { icon: FaDiscord, label: "Discord" },
                { icon: Send, label: "Telegram" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Mail, label: "Email" },
              ].map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  className="flex items-center justify-center w-9 h-9 border border-background/30 text-background/60 hover:bg-background hover:text-foreground transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter — 3 cols */}
          <div className="lg:col-span-3 pt-6 sm:pt-0 sm:pl-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-background/50 mb-3">
              Newsletter
            </p>
            <p className="font-body text-sm text-background/70 leading-relaxed mb-4">
              First to know about new roles, insights, and opportunities in the
              crypto space.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex border border-background/30">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-3 py-2 font-sans text-sm text-background placeholder:text-background/40 focus:outline-none min-w-0"
              />
              <button
                type="submit"
                className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest bg-background text-foreground hover:bg-[#CC0000] hover:text-white transition-all duration-200 border-l border-background/30 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="font-mono text-[9px] text-background/40 mt-2">
              No spam. Unsubscribe any time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="border-t border-background/20 px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="font-mono text-[9px] uppercase tracking-widest text-background/40">
          &copy; {new Date().getFullYear()} Web3 Jobs Board. All rights reserved.
        </p>
        <p className="font-mono text-[9px] uppercase tracking-widest text-background/40">
          Connecting Talent · Decentralized Future
        </p>
      </div>
    </footer>
  );
}
