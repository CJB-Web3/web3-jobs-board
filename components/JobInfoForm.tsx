import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobFormSchema } from "@/lib/schemas";
import { JobForm } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { z } from "zod";
import RichTextEditor from "./rich-text-editor";
import {ChevronLeft, ChevronRight} from "lucide-react";
type Props = {
  handleStep1: (data: JobForm) => void;
  defaultValues: JobForm;
  handleBack: () => void;
};

function JobInfoForm({ handleStep1, defaultValues, handleBack }: Props) {
  const form = useForm<z.infer<typeof jobFormSchema>>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = form;
  const watchJobLocation = watch("jobLocation");
  const watchRemoteOptions = watch("remoteOption");
  const watchApply = watch("applyMethod");

  function onSubmit(values: z.infer<typeof jobFormSchema>) {
    handleStep1(values);
    reset();
  }

  return (
    <div className="border border-foreground">
      {/* Section header */}
      <div className="border-b border-foreground px-6 py-4">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#CC0000] mb-1">
          ■ Step 2
        </p>
        <h2 className="font-headline text-2xl font-black uppercase tracking-tight flex gap-2 items-center">
          <HiOutlineBriefcase className="w-6 h-6" />
          Job Information
        </h2>
        <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
          Fill in the relevant job details for your listing
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5 px-6 py-5">
            <FormField
              control={control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor="jobTitle">Job Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g.: Business Analyst, FrontEnd Developer, BackEnd Developer, ..."
                      type="text"
                      id="jobTitle"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="role"
              control={control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="jobDescription"
              control={control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor="jobDescription">
                    Job Description
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      placeholder="Please give us a brief description about the job"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <h4 className="font-medium mb-2 text-sm">Type of Position</h4>

              <div className="flex flex-col gap-2">
                <FormField
                  name="fullTime"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-2">
                      <FormControl>
                        <Checkbox
                          id="fullTime"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor="fullTime">Full Time</Label>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="partTime"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-2">
                      <FormControl>
                        <Checkbox
                          id="partTime"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor="partTime">Part Time</Label>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="freelance"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-2">
                      <FormControl>
                        <Checkbox
                          id="freelance"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor="freelance">Freelance</Label>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="internship"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-2">
                      <FormControl>
                        <Checkbox
                          id="internship"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor="internship">Internship</Label>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              name="jobLocation"
              control={control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Job Location</FormLabel>

                  <FormControl>
                    <RadioGroup
                      className="flex flex-col gap-2"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="onsite" />
                        </FormControl>
                        <FormLabel>On site</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="remote" />
                        </FormControl>
                        <FormLabel>Remote</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="hybrid" />
                        </FormControl>
                        <FormLabel>Hybrid</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {(watchJobLocation === "onsite" ||
              watchJobLocation === "hybrid") && (
              <FormField
                name="locationDetails"
                control={control}
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 ease-in-out animate-fade-in-down space-y-1">
                    <FormLabel htmlFor="locationDetails">
                      Location Details
                    </FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        id="locationDetails"
                        placeholder="Write your office location"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(watchJobLocation === "remote" ||
              watchJobLocation === "hybrid") && (
              <FormField
                name="remoteOption"
                control={control}
                render={({ field }) => (
                  <FormItem className="animate-fade-in-down space-y-2 transition-all duration-300 ease-in-out">
                    <FormLabel>Remote Options</FormLabel>

                    <FormControl>
                      <RadioGroup
                        className="flex flex-col gap-2"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="global" />
                          </FormControl>
                          <FormLabel>Global</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="geographic" />
                          </FormControl>
                          <FormLabel>Geographic Restrictions</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="timezone" />
                          </FormControl>
                          <FormLabel>Timezone Restrictions</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchRemoteOptions === "geographic" && (
              <FormField
                name="geographicRestrictions"
                control={control}
                render={({ field }) => (
                  <FormItem className="animate-fade-in-down space-y-1 transition-all duration-300 ease-in-out">
                    <FormLabel htmlFor="geographicRestrictions">
                      Geographic Restrictions
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="geographicRestrictions"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchRemoteOptions === "timezone" && (
              <FormField
                name="timezoneRestrictions"
                control={control}
                render={({ field }) => (
                  <FormItem className="animate-fade-in-down space-y-1 transition-all duration-300 ease-in-out">
                    <FormLabel htmlFor="timezoneRestrictions">
                      Timezone Restrictions
                    </FormLabel>
                    <FormControl>
                      <Input type="text" id="timezoneRestrictions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              name="keywords"
              control={control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor="keywords">Keywords</FormLabel>
                  <FormDescription>
                    Please use comma to separate the keywords
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      id="keywords"
                      placeholder="e.g.: eth, react, binance, ..."
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  name="salaryCurrency"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="salaryCurrency">
                        Salary Currency <span className="text-muted-foreground text-sm font-normal">Optional</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Currency" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Currency</SelectLabel>

                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="minSalary"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Salary <span className="text-muted-foreground text-sm font-normal">Optional</span></FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          id="minSalary"
                          placeholder="Min"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="maxSalary"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Salary <span className="text-muted-foreground text-sm font-normal">Optional</span></FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          id="maxSalary"
                          placeholder="Max"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="minEquity"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Equity (%) <span className="text-muted-foreground text-sm font-normal">Optional</span></FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          id="minEquity"
                          placeholder="Min"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="maxEquity"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Equity (%) <span className="text-muted-foreground text-sm font-normal">Optional</span></FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          id="maxEquity"
                          placeholder="Max"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Payment Method</FormLabel>

                  <FormControl>
                    <RadioGroup
                      className="flex flex-col gap-2"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Cash" />
                        </FormControl>
                        <FormLabel>Cash</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Cryptocurrency" />
                        </FormControl>
                        <FormLabel>Cryptocurrency</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Hybrid" />
                        </FormControl>
                        <FormLabel>Cash or Cryptocurrency</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="applyMethod"
              control={control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>How to Apply</FormLabel>

                  <FormControl>
                    <RadioGroup
                      className="flex flex-col gap-2"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="website" />
                        </FormControl>
                        <FormLabel>Apply by Website</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="email" />
                        </FormControl>
                        <FormLabel>Apply by Email</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {watchApply === "website" && (
              <FormField
                name="applyWebsite"
                control={control}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 animate-fade-in-down">
                    <FormLabel htmlFor="applyWebsite">
                      Application Website
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        id="applyWebsite"
                        placeholder="https://yourCompany.com"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchApply === "email" && (
              <FormField
                name="applyEmail"
                control={control}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 animate-fade-in-down">
                    <FormLabel htmlFor="applyEmail">
                      Application Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        id="applyEmail"
                        placeholder="yourCompany@gmail.com"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="border-t border-foreground px-6 py-4 flex justify-between">
            <Button type="button" variant={"outline"} onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" /> Go back
            </Button>
            <Button type="submit">Preview <ChevronRight className="h-4 w-4" /></Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default JobInfoForm;
