"use client";
import { createJobPosting } from "@/lib/post-job-actions";
import { defaultCompanyValues, defaultJobValues } from "@/lib/defaultValues";
import {
  CompanyForm,
  JobData,
  JobForm,
  PaymentForm,
  ReusableCompany,
} from "@/lib/types";
import { useEffect, useState } from "react";
import { HiCheck } from "react-icons/hi2";
import dynamic from "next/dynamic";

const CompanyFormSkeleton = () => (
  <div className="border border-foreground p-6 min-h-[500px] w-full animate-pulse">
    <div className="h-6 bg-muted w-1/3 mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-muted w-1/4"></div>
          <div className="h-10 bg-muted w-full"></div>
        </div>
      ))}
      <div className="h-10 bg-muted w-1/3 mt-6"></div>
    </div>
  </div>
);

const JobFormSkeleton = CompanyFormSkeleton;
const PreviewSkeleton = () => (
  <div className="border border-foreground p-6 min-h-[600px] w-full animate-pulse">
    <div className="h-6 bg-muted w-1/3 mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-4 bg-muted w-full"></div>
      ))}
    </div>
  </div>
);

const PaymentInfoSkeleton = () => (
  <div className="border border-foreground p-6 min-h-[400px] w-full animate-pulse">
    <div className="h-6 bg-muted w-1/3 mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-muted w-1/4"></div>
          <div className="h-10 bg-muted w-full"></div>
        </div>
      ))}
      <div className="h-10 bg-muted w-1/3 mt-6"></div>
    </div>
  </div>
);

const PaymentCheckoutSkeleton = () => (
  <div className="border border-foreground p-6 min-h-[450px] w-full animate-pulse">
    <div className="h-6 bg-muted w-1/3 mb-6"></div>
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-10 bg-muted w-full"></div>
      ))}
    </div>
  </div>
);

// Import components with proper loading states
const CompanyInfoForm = dynamic(() => import("./CompanyInfoForm"), {
  loading: () => <CompanyFormSkeleton />,
  ssr: false,
});

const JobInfoForm = dynamic(() => import("./JobInfoForm"), {
  loading: () => <JobFormSkeleton />,
  ssr: false,
});

const FormPreview = dynamic(() => import("./FormPreview"), {
  loading: () => <PreviewSkeleton />,
  ssr: false,
});

const PaymentInfo = dynamic(() => import("./PaymentInfo"), {
  loading: () => <PaymentInfoSkeleton />,
  ssr: false,
});

const PaymentCheckoutForm = dynamic(() => import("./PaymentCheckoutForm"), {
  loading: () => <PaymentCheckoutSkeleton />,
  ssr: false,
});

function JobListingForm({
  reusableCompanies,
}: {
  reusableCompanies: ReusableCompany[];
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [jobFormData, setJobFormData] = useState<JobForm>(defaultJobValues);
  const [companyFormData, setCompanyFormData] =
    useState<CompanyForm>(defaultCompanyValues);
  const [job, setJob] = useState<JobData | null>(null);
  const [contentHeight, setContentHeight] = useState("auto");
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStep0(formData: CompanyForm) {
    setCompanyFormData(formData);
    setContentHeight(
      document.getElementById("form-content")?.offsetHeight + "px" || "auto"
    );
    setTimeout(() => {
      setCurrentStep(1);
      scrollToTop();
      setTimeout(() => setContentHeight("auto"), 100);
    }, 50);
  }

  function handleStep1(formData: JobForm) {
    setJobFormData(formData);
    setContentHeight(
      document.getElementById("form-content")?.offsetHeight + "px" || "auto"
    );
    setTimeout(() => {
      setCurrentStep(2);
      scrollToTop();
      setTimeout(() => setContentHeight("auto"), 100);
    }, 50);
  }

  function handleStep2() {
    setContentHeight(
      document.getElementById("form-content")?.offsetHeight + "px" || "auto"
    );
    setTimeout(() => {
      setCurrentStep(3);
      scrollToTop();
      setTimeout(() => setContentHeight("auto"), 100);
    }, 50);
  }

  async function handleStep3(values: PaymentForm) {
    setSubmissionError(null);

    if (!companyFormData.companyLogo) {
      setSubmissionError(
        "Company logo is missing. Please go back to the 'Company Info' step to upload it."
      );
      return;
    }

    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      const companyLogoBase64 = await fileToBase64(
        companyFormData.companyLogo as File
      );

      const newJob = {
        ...jobFormData,
        ...companyFormData,
        companyLogo: {
          name: (companyFormData.companyLogo as File).name,
          type: (companyFormData.companyLogo as File).type,
          base64: companyLogoBase64,
        },
        paymentCurrency: values.paymentCurrency,
        featured: values.jobPkg === "pkg-2",
      };

      setContentHeight(
        document.getElementById("form-content")?.offsetHeight + "px" || "auto"
      );
      const createdJob = await createJobPosting(newJob);
      setJob(createdJob);

      setTimeout(() => {
        setCurrentStep(4);
        scrollToTop();
        setTimeout(() => setContentHeight("auto"), 100);
      }, 50);
    } catch {
      setSubmissionError("An unexpected error occurred while creating the job posting. Please try again.");
    }
  }

  useEffect(() => {
    if (currentStep > 0) {
      scrollToTop();
    }
  }, [currentStep]);

  const handleBack = () => {
    if (currentStep > 0) {
      if (submissionError) setSubmissionError(null);

      setContentHeight(
        document.getElementById("form-content")?.offsetHeight + "px" || "auto"
      );
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        scrollToTop();
        setTimeout(() => setContentHeight("auto"), 100);
      }, 50);
    }
  };

  const steps = [
    "Company Info",
    "Job Info",
    "Preview",
    "Payment Info",
    "Payment",
  ];

  return (
    <div className="min-h-screen z-10 space-y-8">
      {/* Newspaper-style step progress bar */}
      <div className="hidden md:block border-b border-foreground pb-4">
        <div className="flex justify-between items-start">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center w-1/5 relative">
              {/* Connecting rule line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-3 left-1/2 w-full h-px transition-colors duration-200 ${
                    index < currentStep ? "bg-foreground" : "bg-muted"
                  }`}
                />
              )}
              {/* Step marker */}
              <div
                className={`relative z-10 w-6 h-6 flex items-center text-[10px] font-sans font-bold justify-center border transition-all duration-200 ${
                  index < currentStep
                    ? "bg-foreground text-background border-foreground"
                    : index === currentStep
                    ? "bg-[#CC0000] text-background border-[#CC0000]"
                    : "bg-background text-muted-foreground border-muted-foreground"
                }`}
              >
                {index < currentStep ? (
                  <HiCheck className="w-3 h-3" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`mt-2 font-sans text-[9px] uppercase tracking-widest text-center ${
                  index === currentStep
                    ? "text-[#CC0000]"
                    : index < currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        id="form-content"
        className="transition-all duration-300 ease-in-out"
        style={{ minHeight: contentHeight }}
      >
        {currentStep === 0 && (
          <CompanyInfoForm
            companies={reusableCompanies}
            defaultValues={companyFormData}
            handleStep0={handleStep0}
          />
        )}

        {currentStep === 1 && (
          <JobInfoForm
            defaultValues={jobFormData}
            handleStep1={handleStep1}
            handleBack={handleBack}
          />
        )}

        {currentStep === 2 && (
          <FormPreview
            formData={{ ...jobFormData, ...companyFormData }}
            onBack={handleBack}
            handleStep2={handleStep2}
          />
        )}

        {currentStep === 3 && (
          <PaymentInfo
            handleBack={handleBack}
            handleStep3={handleStep3}
            submissionError={submissionError}
          />
        )}

        {currentStep === 4 && job && <PaymentCheckoutForm job={job} />}
      </div>
    </div>
  );
}

export default JobListingForm;
