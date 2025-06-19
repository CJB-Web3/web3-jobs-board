import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import ContextProvider from '@/context';
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Web3 Jobs Board | Find Top Web3, Blockchain & Crypto Jobs",
  description: "Explore the latest Web3 jobs, Blockchain careers & Crypto opportunities on Web3 Jobs Board. Find remote roles in DeFi, NFTs, Marketing & more!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get('cookie');
  return (
    
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased scroll-smooth`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navbar />
          <ContextProvider cookies={cookies}>
          {children}
          </ContextProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
