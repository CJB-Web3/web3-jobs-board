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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { paymentFormSchema } from "@/lib/schemas";
import { PaymentForm } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { FaBitcoin } from "react-icons/fa";
import { z } from "zod";

type Props = {
  handleBack: () => void;
  handleStep3: (values: PaymentForm) => void;
  submissionError: string | null; // Accept the error message
};

export default function PaymentInfo({
  handleBack,
  handleStep3,
  submissionError,
}: Props) {
  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      jobPkg: "pkg-1",
      paymentCurrency: "usd", // Keep for compatibility but won't be used
    },
  });

  const { control, handleSubmit } = form;

  async function onSubmit(values: z.infer<typeof paymentFormSchema>) {
    await handleStep3(values);
  }

  return (
    <Card className="py-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <FaBitcoin className="w-6 h-6" />
              <p>Payment Information</p>
            </CardTitle>
            <CardDescription>
              Select your package and pay with cryptocurrency
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <FormField
              control={control}
              name="jobPkg"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Select your package</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col gap-2"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pkg-1" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Basic - <span className="line-through">$160</span>{" "}
                          <span>$80</span>
                        </FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pkg-2" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Featured - <span className="line-through">$300</span>{" "}
                          <span>$150</span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium mb-2">Payment Methods Accepted:</h4>
              <ul className="text-sm space-y-1">
                <li>• USDC, USDT, or DAI</li>
                <li>
                  • Networks: Ethereum, Polygon, BNB Chain, Base (Testnet)
                </li>
                <li>• Connect your wallet in the next step</li>
              </ul>
            </div>
          </CardContent>

          {/* This is the new error display section */}
          {submissionError && (
            <div className="px-6 pb-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Submission Failed</AlertTitle>
                <AlertDescription>{submissionError}</AlertDescription>
              </Alert>
            </div>
          )}

          <CardFooter className="mt-2 flex justify-between">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" />
              Go back
            </Button>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <span className="">Proceeding...</span>
                  <span className="animate-spin">
                    <Loader2 className="h-4 w-4" />
                  </span>
                </>
              ) : (
                <>
                  Proceed <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}