"use client";
import getStripe from "@/lib/get-stripejs";
import { JobData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

// Load Inter font
const inter = Inter({ subsets: ["latin"] });

type Props = {
  clientSecret: string;
  job: JobData;
};

const stripePromise = getStripe();

export default function PaymentCheckoutForm({ clientSecret, job }: Props) {
  const { theme } = useTheme();
  const [appearance, setAppearance] = useState({});

  useEffect(() => {
    setAppearance({
      theme: theme === "dark" ? "night" : "flat",
      variables: {
        colorPrimary: "hsl(var(--primary))",
        colorBackground: "hsl(var(--background))",
        colorDanger: "hsl(var(--destructive))",
        borderRadius: "0.5rem",
        fontFamily: inter.style.fontFamily,
        fontSizeBase: "16px",
      },
      rules: {
        ".Input": {
          fontFamily: inter.style.fontFamily,
        },
      },
    });
  }, [theme]);

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      <div className={inter.className}>{job && <Form job={job} />}</div>
    </Elements>
  );
}

function Form({ job }: { job: JobData }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_URL}/payment-success`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        console.log(error.message || "An unexpected error occurred.");
      } else {
        console.log("An unexpected error occurred.");
      }
    }

    setIsLoading(false);
  }

  const price = formatCurrency(job.payableAmount, job.paymentCurrency);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Job Posting Checkout
        </CardTitle>
        <CardDescription>
          Please review your job details and complete the payment
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* <div className="space-y-2">
          <h3 className="text-lg font-semibold">{job.jobTitle}</h3>
          <p className="text-sm text-muted-foreground">{job.companyName}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">{job.jobLocation}</Badge>
            <Badge variant="outline">{job.role}</Badge>
            {job.featured && <Badge variant="secondary">Featured</Badge>}
          </div>
        </div> */}

        <JobCard job={job} hideFooter={true} />

        <Separator />

        <div className="space-y-2">
          <h4 className="font-medium">Posting Details</h4>
          <ul className="text-sm space-y-1">
            <li>Type: {job.featured ? "Featured" : "Basic"} Plan</li>
            <li>Duration: 30 days</li>
            <li>Payment Currency: {job.paymentCurrency.toUpperCase()}</li>
          </ul>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-2">Payment Details</h4>
          <PaymentElement />
        </div>
      </CardContent>

      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full">
          <Button
            type="submit"
            disabled={!stripe || isLoading}
            className="w-full mt-4"
          >
            {isLoading ? (
              <>
                <span className="">Processing...</span>
                <span className="animate-spin">
                  <Loader2 className="h-4 w-4" />
                </span>
              </>
            ) : (
              `Pay ${price}`
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
