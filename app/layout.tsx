import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import {
  Inter,
  Lora,
  Playfair_Display,
} from "next/font/google";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});


const SITE_URL = "https://www.web3jobsboard.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Web3 Jobs Board | Find Top Web3, Blockchain & Crypto Jobs",
    template: "%s | Web3 Jobs Board",
  },
  description:
    "Explore the latest Web3 jobs, Blockchain careers & Crypto opportunities on Web3 Jobs Board. Find remote roles in DeFi, NFTs, Marketing & more!",
  keywords:
    "web3 jobs, blockchain jobs, crypto jobs, DeFi jobs, NFT jobs, remote blockchain jobs, web3 careers, crypto careers, blockchain developer jobs, smart contract jobs",
  authors: [{ name: "Web3 Jobs Board", url: SITE_URL }],
  creator: "Web3 Jobs Board",
  publisher: "Web3 Jobs Board",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Web3 Jobs Board",
    title: "Web3 Jobs Board | Find Top Web3, Blockchain & Crypto Jobs",
    description:
      "Explore the latest Web3 jobs, Blockchain careers & Crypto opportunities on Web3 Jobs Board. Find remote roles in DeFi, NFTs, Marketing & more!",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Web3 Jobs Board - Find Top Web3, Blockchain & Crypto Jobs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Web3JobsBoard",
    creator: "@Web3JobsBoard",
    title: "Web3 Jobs Board | Find Top Web3, Blockchain & Crypto Jobs",
    description:
      "Explore the latest Web3 jobs, Blockchain careers & Crypto opportunities on Web3 Jobs Board.",
    images: [`${SITE_URL}/og-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get("cookie");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${lora.variable} ${inter.variable} font-sans antialiased scroll-smooth`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <Navbar />
          <ContextProvider cookies={cookies}>{children}</ContextProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
