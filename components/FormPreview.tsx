"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import JobPreviewContent from "@/components/JobPreviewContent";
import { JobData, JobListing } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  formData: JobListing;
  onBack: () => void;
  handleStep2: () => void;
};

function FormPreview({ formData, onBack, handleStep2 }: Props) {
  const previewCreatedAt = useMemo(() => new Date().toISOString(), []);
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!formData.companyLogo) {
      setPreviewLogoUrl(null);
      return;
    }

    let isActive = true;
    const reader = new FileReader();

    reader.onload = () => {
      if (isActive) {
        setPreviewLogoUrl(typeof reader.result === "string" ? reader.result : null);
      }
    };

    reader.onerror = () => {
      if (isActive) {
        setPreviewLogoUrl(null);
      }
    };

    reader.readAsDataURL(formData.companyLogo);

    return () => {
      isActive = false;
    };
  }, [formData.companyLogo]);

  const previewJob = useMemo<JobData>(
    () => ({
      id: 0,
      created_at: previewCreatedAt,
      companyName: formData.companyName,
      companyDescription: formData.companyDescription,
      companyLogo: previewLogoUrl,
      companyWebsite: formData.companyWebsite,
      companyEmail: formData.companyEmail,
      companyTwitter: formData.companyTwitter,
      companyDiscord: formData.companyDiscord,
      jobTitle: formData.jobTitle,
      jobDescription: formData.jobDescription,
      role: formData.role,
      partTime: formData.partTime,
      fullTime: formData.fullTime,
      freelance: formData.freelance,
      internship: formData.internship,
      jobLocation: formData.jobLocation,
      locationDetails: formData.locationDetails || null,
      remoteOption: formData.remoteOption,
      geographicRestrictions: formData.geographicRestrictions || null,
      timezoneRestrictions: formData.timezoneRestrictions || null,
      keywords: formData.keywords,
      salaryCurrency: formData.salaryCurrency || null,
      minSalary: formData.minSalary || null,
      maxSalary: formData.maxSalary || null,
      minEquity: formData.minEquity || null,
      maxEquity: formData.maxEquity || null,
      paymentMethod: formData.paymentMethod || null,
      applyMethod: formData.applyMethod,
      applyEmail: formData.applyEmail || null,
      applyWebsite: formData.applyWebsite || null,
      featured: false,
      paymentStatus: "unpaid",
      paymentCurrency: "usd",
      payableAmount: 0,
      expiryDate: null,
      transactionHash: null,
    }),
    [formData, previewCreatedAt, previewLogoUrl]
  );

  return (
    <div className="border border-foreground">
      <div className="border-b border-foreground px-6 py-4">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#CC0000] mb-1">
          ■ Step 3 — Preview
        </p>
        <h2 className="font-headline text-2xl font-black uppercase tracking-tight">
          Listing Preview
        </h2>
        <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
          Review your listing before proceeding to payment
        </p>
      </div>

      <div className="border-b border-foreground bg-gradient-to-br from-background to-secondary/10 p-6">
        <div className="border border-foreground bg-background p-6">
          <JobPreviewContent job={previewJob} showPostedAt={false} />
        </div>
      </div>

      <div className="px-6 py-4 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" /> Go Back
        </Button>
        <Button onClick={handleStep2}>Payment <ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

export default FormPreview;
