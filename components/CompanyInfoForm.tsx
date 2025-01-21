import { companyFormSchema } from "@/lib/schemas";
import { CompanyForm } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { z } from "zod";
import RichTextEditor from "./rich-text-editor";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { FileUpload } from "./ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

type Props = {
  defaultValues: CompanyForm;
  handleStep0: (formData: CompanyForm) => void;
};

export default function CompanyInfoForm({ defaultValues, handleStep0 }: Props) {
  const form = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
  });
  const { control, handleSubmit } = form;

  function onSubmit(values: z.infer<typeof companyFormSchema>) {
    handleStep0(values);
  }

  return (
    <Card className="dark:shadow-purple-900 py-4">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <HiOutlineBuildingOffice className="w-6 h-6" />
          <p>Company Information</p>
        </CardTitle>
        <CardDescription>
          Please fillup the fields with your relevant company details
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor="companyName">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please enter your company name here"
                      type="text"
                      id="companyName"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor="companyDescription">
                    Description
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      placeholder="Please give us a brief description about your company"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="companyLogo"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel htmlFor="companyLogo">Logo</FormLabel>
                  <FormControl>
                    <div className="rounded-md border">
                      <FileUpload
                        onChange={(files) =>
                          files.length > 0 && onChange(files[files.length - 1])
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor="companyWebsite">Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please enter your company website here"
                      type="text"
                      id="companyWebsite"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="companyEmail">Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="yourCompany@gmail.com"
                      id="companyEmail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="companyTwitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="companyTwitter">
                      Twitter/X (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="https://x.com/companyTwitter"
                        id="companyTwitter"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="companyDiscord"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="companyDiscord">
                      Discord (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="https://discord.gg/company"
                        id="companyDiscord"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="mt-2 flex justify-end">
            <Button>Next &rarr;</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
