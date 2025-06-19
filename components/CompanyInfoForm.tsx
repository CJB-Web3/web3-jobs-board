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
import { useEffect, useState } from "react";
import { getCompanies } from "@/lib/actions";
import { companyData } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {ChevronRight} from "lucide-react";

type Props = {
  defaultValues: CompanyForm;
  handleStep0: (formData: CompanyForm) => void;
};

export default function CompanyInfoForm({ defaultValues, handleStep0 }: Props) {
  const [companies, setCompanies] = useState<companyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
  });
  const { control, handleSubmit, reset } = form;

  // Helper to convert image URL to File
  const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesData = await getCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Handler for existing-company submission, including logo file conversion
  const handleExistingSubmit = async () => {
    if (!selectedCompanyId) return;
    const selected = companies.find(
      (company) => company.id.toString() === selectedCompanyId
    );
    if (selected) {
      let logoFile: File | null = null;
      if (selected.companyLogo) {
        try {
          // derive filename and type from URL if possible
          const urlParts = selected.companyLogo.split("/");
          const rawFilename = urlParts[urlParts.length - 1] || "logo.png";
          const extension = rawFilename.split('.').pop() || 'png';
          const mimeType = `image/${extension}`;
          logoFile = await urlToFile(selected.companyLogo, rawFilename, mimeType);
        } catch (error) {
          console.error("Error fetching logo as file:", error);
        }
      }
      const companyFormData: CompanyForm = {
        companyName: selected.companyName,
        companyDescription: selected.companyDescription,
        companyLogo: logoFile,
        companyWebsite: selected.companyWebsite,
        companyEmail: selected.companyEmail || "",
        companyTwitter: selected.companyTwitter || "",
        companyDiscord: selected.companyDiscord || "",
      };
      handleStep0(companyFormData);
    }
  };

  // Regular onSubmit for new companies (with validation)
  const onSubmit = (values: z.infer<typeof companyFormSchema>) => {
    handleStep0(values);
  };

  const selectedCompany = selectedCompanyId
    ? companies.find((company) => company.id.toString() === selectedCompanyId)
    : null;

  return (
    <Card className="dark:shadow-purple-900 py-4">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <HiOutlineBuildingOffice className="w-6 h-6" />
          <p>Company Information</p>
        </CardTitle>
        <CardDescription>
          {selectedCompany
            ? "You've selected an existing company. Click Next to continue."
            : "Please fill in the fields with your company details or select an existing company"}
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (selectedCompanyId) {
              await handleExistingSubmit();
            } else {
              handleSubmit(onSubmit)();
            }
          }}
        >
          <CardContent className="flex flex-col gap-4">
            {/* Company Selection Dropdown */}
            <div className="space-y-1">
              <FormLabel>Select Company</FormLabel>
              <Select
                onValueChange={(val) => {
                  if (val === "new") {
                    setSelectedCompanyId(null);
                    reset(defaultValues);
                  } else {
                    setSelectedCompanyId(val);
                  }
                }}
                value={selectedCompanyId || "new"}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      loading
                        ? "Loading companies..."
                        : "Select an existing company or create new"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Create New Company</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCompany && (
              <div className="border rounded-lg p-4 bg-muted/10">
                <div className="flex items-start gap-4">
                  {selectedCompany.companyLogo && (
                    <div className="h-16 w-16 rounded-md border bg-background flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <img 
                        src={selectedCompany.companyLogo} 
                        alt={`${selectedCompany.companyName} logo`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{selectedCompany.companyName}</h3>
                    
                    <div className="mt-1 text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{ 
                        __html: selectedCompany.companyDescription.length > 150 
                          ? selectedCompany.companyDescription.substring(0, 150) + '...' 
                          : selectedCompany.companyDescription 
                      }}
                    />
                    
                    <div className="mt-3 grid gap-1">
                      {selectedCompany.companyWebsite && (
                        <div className="flex gap-2 text-sm">
                          <span className="font-medium">Website:</span>
                          <a 
                            href={selectedCompany.companyWebsite} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:underline truncate"
                          >
                            {selectedCompany.companyWebsite}
                          </a>
                        </div>
                      )}
                      
                      {selectedCompany.companyEmail && (
                        <div className="flex gap-2 text-sm">
                          <span className="font-medium">Email:</span>
                          <span>{selectedCompany.companyEmail}</span>
                        </div>
                      )}
                      
                      <div className="flex gap-4 mt-1">
                        {selectedCompany.companyTwitter && (
                          <a 
                            href={selectedCompany.companyTwitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            Twitter/X
                          </a>
                        )}
                        
                        {selectedCompany.companyDiscord && (
                          <a 
                            href={selectedCompany.companyDiscord} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            Discord
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Show form fields only when no company is selected */}
            {!selectedCompany && (
              <>
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
              </>
            )}

          </CardContent>

          <CardFooter className="mt-2 flex justify-end">
            <Button type="submit">Next <ChevronRight className="h-4 w-4" /></Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
