import { Metadata } from 'next';
import JobListingForm from "@/components/JobListingForm";
import { Suspense } from 'react'; // Import Suspense for dynamic loading fallback

export const metadata: Metadata = {
  title: 'Post a Web3 Job | Web3 Jobs Board - List Your Blockchain Vacancy',
  description: 'Recruit top talent in the blockchain & Web3 space. Post your job opening on Web3 Jobs Board today – reach developers, marketers, designers, and more.',
  keywords: 'post web3 job, post blockchain job, hire web3 talent, blockchain recruitment, crypto jobs, web3 careers, list job vacancy, web3 job board',
  openGraph: {
    title: 'Post a Job | Web3 Jobs Board',
    description: 'Easily list your Web3 or blockchain job openings and connect with qualified candidates.',
    url: 'https://www.web3jobsboard.com/post-job', // Make sure this URL is correct
    siteName: 'Web3 Jobs Board',
    // Add a relevant image URL for social sharing previews if available
    // images: [
    //   {
    //     url: 'https://www.web3jobsboard.com/og-image-post-job.png', // Replace with your actual image URL
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Post a Web3 Job | Web3 Jobs Board',
    description: 'Recruit top talent in the blockchain & Web3 space. Post your job opening on Web3 Jobs Board today.',
    // Add your Twitter handle if you have one
    // site: '@YourTwitterHandle',
    // creator: '@YourTwitterHandle',
    // Add the same image as og:image
    // images: ['https://www.web3jobsboard.com/twitter-image-post-job.png'], // Replace with your actual image URL
  },
  alternates: {
    canonical: 'https://www.web3jobsboard.com/post-job', // Make sure this URL is correct
  },
};


function PostJobPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
       <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
         Post Your Job
       </h1>
       {/* Wrap JobListingForm with Suspense for dynamic loading */}
       <Suspense fallback={<div className="text-center p-10">Loading form...</div>}>
         <JobListingForm />
       </Suspense>
    </div>
  );
}

export default PostJobPage;