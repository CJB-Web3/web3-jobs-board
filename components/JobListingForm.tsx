"use client";
import { createJobPosting } from "@/lib/actions";
import { defaultCompanyValues, defaultJobValues } from "@/lib/defaultValues";
import { CompanyForm, JobData, JobForm, PaymentForm } from "@/lib/types";
import { useEffect, useState } from "react";
import { HiCheck } from "react-icons/hi2";
import CompanyInfoForm from "./CompanyInfoForm";
import FormPreview from "./FormPreview";
import JobInfoForm from "./JobInfoForm";
import PaymentCheckoutForm from "./PaymentCheckoutForm";
import PaymentInfo from "./PaymentInfo";

function JobListingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [jobFormData, setJobFormData] = useState<JobForm>(defaultJobValues);
  const [companyFormData, setCompanyFormData] =
    useState<CompanyForm>(defaultCompanyValues);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [job, setJob] = useState<JobData | null>(null);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStep0(formData: CompanyForm) {
    setCompanyFormData(formData);
    setCurrentStep(1);
    scrollToTop();
  }

  function handleStep1(formData: JobForm) {
    setJobFormData(formData);
    setCurrentStep(2);
    scrollToTop();
  }

  function handleStep2() {
    setCurrentStep(3);
    scrollToTop();
  }

  async function handleStep3(values: PaymentForm) {
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    };

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
      paymentStatus: "unpaid",
    };

    const { clientSecret, job } = await createJobPosting(newJob);
    setClientSecret(clientSecret);
    setJob(job);

    setCurrentStep(4);
    scrollToTop();
  }

  useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    "Company Info",
    "Job Info",
    "Preview",
    "Payment Info",
    "Payment",
  ];

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 mt-20 py-20 z-10 space-y-8">
      <div className="hidden md:flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center w-1/5">
            <div
              className={`w-full h-1 ${
                index <= currentStep ? "bg-purple-600" : "bg-gray-200"
              } transition-all duration-300 ease-in-out ${
                index === 0
                  ? "rounded-l-full"
                  : index === steps.length - 1
                  ? "rounded-r-full"
                  : ""
              }`}
            ></div>
            <div
              className={`mt-3 w-8 h-8 flex border items-center text-xs font-semibold justify-center rounded-full ${
                index <= currentStep
                  ? "bg-purple-600 text-slate-300 border-transparent"
                  : "bg-transparent text-purple-500"
              } transition-all duration-300 ease-in-out`}
            >
              {index + 1 <= currentStep ? <HiCheck /> : index + 1}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                index === currentStep
                  ? "text-purple-500"
                  : "text-muted-foreground"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

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
  );
}

export default JobListingForm;
