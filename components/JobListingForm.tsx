"use client";
import { createJobPosting } from "@/lib/actions";
import { defaultCompanyValues, defaultJobValues } from "@/lib/defaultValues";
import { CompanyForm, JobData, JobForm, PaymentForm } from "@/lib/types";
import { useEffect, useState, Suspense } from "react";
import { HiCheck } from "react-icons/hi2";

// Pre-defined loading placeholders with fixed dimensions to prevent layout shifts
const CompanyFormSkeleton = () => (
  <div className="border rounded-lg p-6 shadow-sm min-h-[500px] w-full">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      ))}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-6"></div>
    </div>
  </div>
);

const JobFormSkeleton = CompanyFormSkeleton;
const PreviewSkeleton = () => (
  <div className="border rounded-lg p-6 shadow-sm min-h-[600px] w-full">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      ))}
    </div>
  </div>
);

const PaymentInfoSkeleton = () => (
  <div className="border rounded-lg p-6 shadow-sm min-h-[400px] w-full">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      ))}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-6"></div>
    </div>
  </div>
);

const PaymentCheckoutSkeleton = () => (
  <div className="border rounded-lg p-6 shadow-sm min-h-[450px] w-full">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      ))}
    </div>
  </div>
);

// Missing import statement added
import dynamic from 'next/dynamic';

// Import components with proper loading states
const CompanyInfoForm = dynamic(() => import('./CompanyInfoForm'), {
  loading: () => <CompanyFormSkeleton />,
  ssr: false
});

const JobInfoForm = dynamic(() => import('./JobInfoForm'), {
  loading: () => <JobFormSkeleton />,
  ssr: false
});

const FormPreview = dynamic(() => import('./FormPreview'), {
  loading: () => <PreviewSkeleton />,
  ssr: false
});

const PaymentInfo = dynamic(() => import('./PaymentInfo'), {
  loading: () => <PaymentInfoSkeleton />,
  ssr: false
});

const PaymentCheckoutForm = dynamic(() => import('./PaymentCheckoutForm'), {
  loading: () => <PaymentCheckoutSkeleton />,
  ssr: false
});

function JobListingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [jobFormData, setJobFormData] = useState<JobForm>(defaultJobValues);
  const [companyFormData, setCompanyFormData] = useState<CompanyForm>(defaultCompanyValues);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [job, setJob] = useState<JobData | null>(null);
  // Add height state to prevent layout shifts when switching between forms
  const [contentHeight, setContentHeight] = useState("auto");

  // Use a smooth scroll with a fixed position
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStep0(formData: CompanyForm) {
    setCompanyFormData(formData);
    // Set fixed height before transitioning to maintain layout stability
    setContentHeight(document.getElementById('form-content')?.offsetHeight + "px" || "auto");
    setTimeout(() => {
      setCurrentStep(1);
      scrollToTop();
      // Reset height after transition
      setTimeout(() => setContentHeight("auto"), 100);
    }, 50);
  }

  function handleStep1(formData: JobForm) {
    setJobFormData(formData);
    setContentHeight(document.getElementById('form-content')?.offsetHeight + "px" || "auto");
    setTimeout(() => {
      setCurrentStep(2);
      scrollToTop();
      setTimeout(() => setContentHeight("auto"), 100);
    }, 50);
  }

  function handleStep2() {
    setContentHeight(document.getElementById('form-content')?.offsetHeight + "px" || "auto");
    setTimeout(() => {
      setCurrentStep(3);
      scrollToTop();
      setTimeout(() => setContentHeight("auto"), 100);
    }, 50);
  }

  async function handleStep3(values: PaymentForm) {
    if (!companyFormData.companyLogo) {
      console.error("Company logo is missing.");
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
        featured: values.jobPkg === "pkg-2" ? true : false,
        paymentStatus: "unpaid" as const,
      };

      setContentHeight(document.getElementById('form-content')?.offsetHeight + "px" || "auto");
      const result = await createJobPosting(newJob);
      setClientSecret(result.clientSecret);
      setJob(result.job);

      setTimeout(() => {
        setCurrentStep(4);
        scrollToTop();
        setTimeout(() => setContentHeight("auto"), 100);
      }, 50);
    } catch (error) {
      console.error("Error processing form step 3:", error);
    }
  }

  useEffect(() => {
    // Only scroll on initial render and step changes
    if (currentStep > 0) {
      scrollToTop();
    }
  }, []);

  const handleBack = () => {
    if (currentStep > 0) {
      setContentHeight(document.getElementById('form-content')?.offsetHeight + "px" || "auto");
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

  // Pre-render all step components to avoid layout shifts, but only show the current one
  return (
    <div className="min-h-screen z-10 space-y-8">
      {/* Fixed-height progress bar to prevent shifts */}
      <div className="h-20 hidden md:block">
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center w-1/5">
              <div
                className={`w-full h-1 ${
                  index <= currentStep ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-700"
                } transition-colors duration-300 ease-in-out ${
                  index === 0
                    ? "rounded-l-full"
                    : index === steps.length - 1
                    ? "rounded-r-full"
                    : ""
                }`}
              ></div>
              <div
                className={`mt-3 w-8 h-8 flex border items-center text-xs font-semibold justify-center rounded-full transition-all duration-300 ease-in-out ${
                  index <= currentStep
                    ? "bg-purple-600 text-white border-transparent"
                    : "bg-transparent border-purple-500 text-purple-500"
                }`}
              >
                {index < currentStep ? <HiCheck className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={`mt-2 text-sm font-medium text-center ${
                  index === currentStep
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content container with minimum height to prevent layout shift */}
      <div 
        id="form-content" 
        className="transition-all duration-300 ease-in-out" 
        style={{ minHeight: contentHeight }}
      >
        {currentStep === 0 && (
          <CompanyInfoForm
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
          <PaymentInfo handleBack={handleBack} handleStep3={handleStep3} />
        )}

        {currentStep === 4 && clientSecret && job && (
          <PaymentCheckoutForm clientSecret={clientSecret} job={job} />
        )}
      </div>
    </div>
  );
}

export default JobListingForm;