"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Audiowide, Spline_Sans } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const splineSans = Spline_Sans({ subsets: ["latin"], weight: "500" });
const audiowide_font = Audiowide({ subsets: ["latin"], weight: "400" });

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = ["Companies", "Pricing"];

  const handleJobsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      const jobsSection = document.getElementById("availableJobs");
      if (jobsSection) {
        jobsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  function handleRedirect(link: string) {
    setIsOpen(false);
    router.push(link);
  }

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            // className="flex-shrink-0"
          >
            <Link href="/" className="flex gap-4 items-center">
              <p
                className={`${audiowide_font.className} font-extrabold tracking-wider text-3xl`}
              >
                CJB
              </p>
            </Link>
          </motion.div>
          <div className="hidden md:flex items-center space-x-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 * 0.1 }}
            >
              <Link
                href={`/#availableJobs`}
                className="py-2 rounded-md text-base font-medium text-foreground hover:text-primary transition duration-300 ease-in-out relative group"
                onClick={handleJobsClick}
              >
                Jobs
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition duration-300 ease-in-out transform origin-left"></span>
              </Link>
            </motion.div>

            {menuItems.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
              >
                <Link
                  href={`/${item.toLowerCase()}`}
                  className={`${splineSans.className} py-2 rounded-md text-base font-medium text-foreground hover:text-primary transition duration-300 ease-in-out relative group`}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition duration-300 ease-in-out transform origin-left"></span>
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: menuItems.length * 0.1 }}
            >
              <Button asChild>
                <Link href="/post-job">Post a Job</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: menuItems.length * 0.1 }}
            >
              <ModeToggle />
            </motion.div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={handleIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  // className="hover:bg-orange-200"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="hidden">Menu</SheetTitle>
                  <ModeToggle />
                </SheetHeader>
                <div className="flex flex-col space-y-3 mt-6">
                  <Button
                    variant={"ghost"}
                    onClick={() => handleRedirect("/#availableJobs")}
                  >
                    Find Jobs
                  </Button>

                  <Button
                    variant={"ghost"}
                    onClick={() => handleRedirect("/companies")}
                  >
                    Companies
                  </Button>

                  <Button
                    variant={"ghost"}
                    onClick={() => handleRedirect("/Pricing")}
                  >
                    Pricing
                  </Button>

                  <Button onClick={() => handleRedirect("/post-job")}>
                    Post a Job
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      {/* <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            // className="md:hidden bg-background border-t border-border"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href={`/#availableJobs`}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-purple-400 hover:bg-muted transition duration-300 ease-in-out"
                onClick={handleJobsClick}
              >
                Jobs
              </Link>

              {menuItems.map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`${splineSans.className} block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-purple-400 hover:bg-muted transition duration-300 ease-in-out`}
                >
                  {item}
                </Link>
              ))}
              <Link
                href="/post-job"
                className={`${splineSans.className} block px-3 py-2 rounded-md text-base font-medium text-purple-500 hover:text-purple-400 hover:bg-muted transition duration-300 ease-in-out`}
              >
                Post a Job
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </header>
  );
}
