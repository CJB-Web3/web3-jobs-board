import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JobListing } from "@/lib/types";
import { formatSalaryCurrency } from "@/lib/utils";
import {
  BriefcaseBusiness,
  CircleDollarSign,
  Globe,
  Handshake,
  ScrollText,
  Wallet,
} from "lucide-react";
import { Righteous } from "next/font/google";
import ReactHtmlParser from "react-html-parser";

const righteous_font = Righteous({ subsets: ["latin"], weight: "400" });

type Props = {
  formData: JobListing;
  onBack: () => void;
  handleStep2: () => void;
};

function FormPreview({ formData, onBack, handleStep2 }: Props) {
  const {
    jobTitle,
    companyName,
    companyLogo,
    jobLocation,
    locationDetails,
    remoteOption,
    geographicRestrictions,
    timezoneRestrictions,
    partTime,
    fullTime,
    freelance,
    internship,
    minSalary,
    maxSalary,
    minEquity,
    maxEquity,
    salaryCurrency,
    paymentMethod,
    role,
    keywords,
    jobDescription,
  } = formData;

  const getJobType = () => {
    if (fullTime) return "Full-time";
    if (partTime) return "Part-time";
    if (freelance) return "Freelance";
    if (internship) return "Internship";
    return "Not specified";
  };

  const getSalaryRange = () => {
    if (minSalary && maxSalary && salaryCurrency) {
      return `${formatSalaryCurrency(Number(minSalary), salaryCurrency)} 
           - ${formatSalaryCurrency(Number(maxSalary), salaryCurrency)}`;
    }
    return "Not specified";
  };

  const getEquityRange = () => {
    if (minEquity && maxEquity) {
      return `${minEquity}-${maxEquity}%`;
    }
    return null;
  };

  const getLocationDetails = () => {
    if (jobLocation === "onsite") {
      return `On site - ${locationDetails}`;
    } else if (jobLocation === "remote") {
      if (remoteOption === "global") {
        return "Remote - Global";
      } else if (remoteOption === "geographic") {
        return `Remote - ${geographicRestrictions}`;
      } else if (remoteOption === "timezone") {
        return `Remote - ${timezoneRestrictions}`;
      }
    } else if (jobLocation === "hybrid") {
      if (remoteOption === "global") {
        return `On site or Remote - ${locationDetails}, Global`;
      } else if (remoteOption === "geographic") {
        return `On site or Remote - ${locationDetails}, ${geographicRestrictions}`;
      } else if (remoteOption === "timezone") {
        return `On site or Remote - ${locationDetails}, ${timezoneRestrictions}`;
      }
    }
    return "";
  };

  const equityRange = getEquityRange();

  return (
    <Card className="bg-gradient-to-br from-background to-secondary/10">
      <CardHeader>
        <div className="flex items-center mb-6">
          <Avatar className="h-20 w-20 mr-6 border-2 border-primary">
            {companyLogo && (
              <AvatarImage
                src={URL.createObjectURL(companyLogo)}
                alt={companyName}
              />
            )}
            <AvatarFallback>{(companyName as string)[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2
              className={`text-4xl font-bold tracking-wide text-foreground ${righteous_font.className}`}
            >
              {companyName}
            </h2>
            <Badge
              variant="secondary"
              className="mt-2 rounded-md text-sm font-semibold px-3 py-1"
            >
              {role}
            </Badge>
          </div>
        </div>
        <CardTitle
          className={`text-xl md:text-2xl flex items-center gap-3 font-medium mb-4`}
        >
          Role -<span>{jobTitle}</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywords?.split(",").map((keyword, index) => (
            <Badge className="rounded-sm" key={index}>
              {keyword.trim()}
            </Badge>
          ))}
        </div>

        <div className="mt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Globe className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Location</p>
              </div>

              <span className="text-base text-foreground">
                {getLocationDetails()}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <BriefcaseBusiness className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Job Type</p>
              </div>

              <span className="text-base text-foreground">{getJobType()}</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <CircleDollarSign className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Compensation Range
                </p>
              </div>

              <span className="text-base text-foreground">
                {getSalaryRange()}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Wallet className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Payment Method</p>
              </div>

              <span className="text-base text-foreground">{paymentMethod}</span>
            </div>

            {equityRange && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <Handshake className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Equity</p>
                </div>
                <span className="text-base text-foreground">{equityRange}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 mt-8">
          <h3 className="text-lg flex items-center">
            <ScrollText className="w-6 h-6 mr-2 text-primary" />
            Job Description
          </h3>
          <div className="whitespace-pre-wrap text-muted-foreground text-lg leading-relaxed">
            {ReactHtmlParser(jobDescription as string)}
          </div>
        </div>
      </CardContent>

      <Separator className="my-6" />

      <CardFooter className="p-6 flex justify-between bg-background/80 backdrop-blur-sm">
        <Button variant="outline" onClick={onBack}>
          &larr; Go Back
        </Button>
        <Button onClick={handleStep2}>Payment &rarr;</Button>
      </CardFooter>
    </Card>
  );
}

export default FormPreview;