import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { companyData } from "@/lib/types";
import { Spline_Sans } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineBellAlert } from "react-icons/hi2";

const spline_sans = Spline_Sans({ subsets: ["latin"], weight: "500" });

export default function CompanyCard({
  companyInfo,
}: {
  companyInfo: companyData;
}) {
  return (
    <Card className="shadow-sm dark:shadow-purple-950 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex gap-2 items-center mb-1">
          <Avatar>
            {companyInfo.companyLogo ? (
              <Image
                src={companyInfo.companyLogo}
                alt={`${companyInfo.companyName} logo`}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <AvatarFallback>
                {companyInfo.companyName[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <CardTitle className={`${spline_sans.className} tracking-wide`}>
            {companyInfo.companyName}
          </CardTitle>
        </div>
        {/* <CardDescription>
          {ReactHtmlParser(companyInfo.companyDescription as string)}
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <HiOutlineBellAlert className="w-4 h-4" />
          <p className="text-sm">
            {companyInfo.activeJobs.length} active job
            {companyInfo.activeJobs.length > 1 && "s"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link
            href={`/companies/${companyInfo.companyName.replaceAll(" ", "_")}`}
          >
            Explore
          </Link>
        </Button>
        <Button asChild>
          <Link
            href={`/companies/${companyInfo.companyName.replaceAll(
              " ",
              "_"
            )}#companyJobs`}
          >
            See jobs
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
