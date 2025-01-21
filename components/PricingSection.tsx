import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Sparkles } from "lucide-react";
import { Spline_Sans } from "next/font/google";
import React from "react";

const splineSans = Spline_Sans({ subsets: ["latin"], weight: "500" });

const features = {
  basic: [
    "Job post is live for 30 days",
    "Standard placement in search results",
    "Basic company branding",
    "Email support",
    "Social media post (1x)",
    "No account required",
  ],
  featured: [
    "Job post is live for 30 days",
    "Top placement on the front page",
    "Top placement in filtered search results",
    "Highlighted to stand out",
    "Premium company branding with 'Featured' label",
    "Featured in our newsletter",
    "Multiple social media posts",
    // "Volume discounts: up to 20% off",
    "No account required",
    "Dedicated priority support",
  ],
};

const comparisonFeatures = [
  { name: "Post Duration", basic: "30 days", featured: "30 days" },
  { name: "Search Placement", basic: "Standard", featured: "Top Position" },
  { name: "Front Page Visibility", basic: "No", featured: "Yes" },
  { name: "Company Branding", basic: "Basic", featured: "Premium with label" },
  { name: "Newsletter Feature", basic: "No", featured: "Yes" },
  { name: "Social Media Posts", basic: "1x", featured: "Multiple" },
  { name: "Support Level", basic: "Email", featured: "Dedicated Priority" },
];

function PricingItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <Check className="h-5 w-5 flex-shrink-0 mt-1" />
      <span className={splineSans.className}>{children}</span>
    </li>
  );
}

export default function PricingSection() {
  return (
    <>
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl font-extrabold tracking-wide text-primary sm:text-5xl ${splineSans.className}`}
            >
              Choose Your Plan
            </h2>
            <p
              className={`mt-4 text-xl text-muted-foreground max-w-2xl mx-auto ${splineSans.className}`}
            >
              Select the perfect plan for your hiring needs. Get your job in
              front of the right candidates.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="flex flex-col justify-between border-2">
                <CardHeader className="space-y-2">
                  <CardTitle
                    className={`text-2xl font-bold ${splineSans.className}`}
                  >
                    Basic Plan
                  </CardTitle>
                  <CardDescription
                    className={`text-base ${splineSans.className}`}
                  >
                    For startups and small companies
                  </CardDescription>
                  <div className="mt-4">
                    <p className={`text-5xl font-bold ${splineSans.className}`}>
                      <span className="line-through text-muted-foreground">
                        $200{" "}
                      </span>
                      <span> $50 </span>
                      <span className="text-lg font-normal text-muted-foreground">
                        /post
                      </span>
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {features.basic.map((feature, i) => (
                      <PricingItem key={i}>{feature}</PricingItem>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${splineSans.className}`}
                    variant="outline"
                    size="lg"
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col justify-between bg-primary text-primary-foreground border-2 border-primary relative">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <span
                    className={`bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${splineSans.className}`}
                  >
                    <Sparkles className="h-4 w-4" />
                    Most Popular
                  </span>
                </div>
                <CardHeader className="space-y-2">
                  <CardTitle
                    className={`text-2xl font-bold ${splineSans.className}`}
                  >
                    Featured Plan
                  </CardTitle>
                  <CardDescription
                    className={`text-primary-foreground/90 text-base ${splineSans.className}`}
                  >
                    For businesses seeking maximum visibility
                  </CardDescription>
                  <div className="mt-4">
                    <p className={`text-5xl font-bold ${splineSans.className}`}>
                      <span className="line-through text-primary-foreground/65">
                        $300{" "}
                      </span>
                      <span> $100 </span>
                      <span className="text-lg font-normal opacity-90">
                        /post
                      </span>
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {features.featured.map((feature, i) => (
                      <PricingItem key={i}>{feature}</PricingItem>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 ${splineSans.className}`}
                    size="lg"
                  >
                    Choose Plan
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <h3
              className={`text-2xl font-bold text-center mb-8 ${splineSans.className}`}
            >
              Compare Plans
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={`w-1/3 ${splineSans.className}`}>
                    Features
                  </TableHead>
                  <TableHead className={`w-1/3 ${splineSans.className}`}>
                    Basic
                  </TableHead>
                  <TableHead className={`w-1/3 ${splineSans.className}`}>
                    Featured
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonFeatures.map((feature, i) => (
                  <TableRow key={i}>
                    <TableCell
                      className={`font-medium ${splineSans.className}`}
                    >
                      {feature.name}
                    </TableCell>
                    <TableCell className={splineSans.className}>
                      {feature.basic}
                    </TableCell>
                    <TableCell className={splineSans.className}>
                      {feature.featured}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </>
  );
}
