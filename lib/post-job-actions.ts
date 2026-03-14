"use server";

import { createHash } from "node:crypto";
import { supabase } from "@/lib/supabase";
import {
  applyJobCouponCodeSchema,
  finalizeJobPaymentSchema,
  jobPostingMetaSchema,
  jobFormSchema,
  serverCompanyFormSchema,
} from "@/lib/schemas";
import {
  PAYMENT_RECIPIENT,
  getChainPaymentConfig,
  getJobPostingPrice,
  getPaymentVerificationMessage,
  isSupportedPaymentChainId,
} from "@/lib/payment-config";
import { sanitizeRichText } from "@/lib/rich-text";
import { JobData } from "@/lib/types";
import {
  createPublicClient,
  decodeEventLog,
  erc20Abi,
  getAddress,
  http,
  isAddressEqual,
  parseUnits,
  recoverMessageAddress,
} from "viem";
import { base, bsc, mainnet, polygon } from "viem/chains";

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
const COUPON_CODE_HASH =
  "59cb8d7777b0a485e6dae9612923d850fbb0898adcad219ae8bf26e4cb0fb0d1";

const publicClients = {
  [mainnet.id]: createPublicClient({ chain: mainnet, transport: http() }),
  [polygon.id]: createPublicClient({ chain: polygon, transport: http() }),
  [bsc.id]: createPublicClient({ chain: bsc, transport: http() }),
  [base.id]: createPublicClient({ chain: base, transport: http() }),
};

function getPublicClient(chainId: number) {
  if (!isSupportedPaymentChainId(chainId)) {
    return null;
  }

  return publicClients[chainId];
}

function normalizeOptionalText(value?: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized === "" ? null : normalized;
}

function normalizeKeywords(value: string) {
  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .join(", ");
}

function getImageExtension(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}

export async function createJobPosting(newJob: unknown) {
  const jobFields = jobFormSchema.parse(newJob);
  const companyFields = serverCompanyFormSchema.parse(newJob);
  const paymentMeta = jobPostingMetaSchema.parse(newJob);

  const objectName = `${crypto.randomUUID()}.${getImageExtension(
    companyFields.companyLogo.type
  )}`;
  const logoBuffer = Buffer.from(
    companyFields.companyLogo.base64.split(",")[1],
    "base64"
  );
  const publicLogo = supabase.storage.from("companyLogo").getPublicUrl(objectName);

  const insertRecord = {
    ...jobFields,
    ...companyFields,
    jobDescription: sanitizeRichText(jobFields.jobDescription),
    companyDescription: sanitizeRichText(companyFields.companyDescription),
    companyLogo: publicLogo.data.publicUrl,
    companyWebsite: normalizeOptionalText(companyFields.companyWebsite),
    companyEmail: normalizeOptionalText(companyFields.companyEmail),
    companyTwitter: normalizeOptionalText(companyFields.companyTwitter),
    companyDiscord: normalizeOptionalText(companyFields.companyDiscord),
    locationDetails: normalizeOptionalText(jobFields.locationDetails),
    geographicRestrictions: normalizeOptionalText(
      jobFields.geographicRestrictions
    ),
    timezoneRestrictions: normalizeOptionalText(jobFields.timezoneRestrictions),
    applyEmail: normalizeOptionalText(jobFields.applyEmail),
    applyWebsite: normalizeOptionalText(jobFields.applyWebsite),
    keywords: normalizeKeywords(jobFields.keywords),
    minSalary: normalizeOptionalText(jobFields.minSalary),
    maxSalary: normalizeOptionalText(jobFields.maxSalary),
    minEquity: normalizeOptionalText(jobFields.minEquity),
    maxEquity: normalizeOptionalText(jobFields.maxEquity),
    featured: paymentMeta.featured,
    paymentCurrency: "usd" as const,
    payableAmount: getJobPostingPrice(paymentMeta.featured),
    paymentStatus: "unpaid" as const,
  };

  let logoUploaded = false;

  try {
    const { error: uploadError } = await supabase.storage
      .from("companyLogo")
      .upload(objectName, logoBuffer, {
        contentType: companyFields.companyLogo.type,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    logoUploaded = true;

    const { data, error } = await supabase
      .from("jobs")
      .insert([insertRecord])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as JobData;
  } catch (error) {
    if (logoUploaded) {
      await supabase.storage.from("companyLogo").remove([objectName]);
    }

    throw error;
  }
}

export async function applyJobCouponCode(input: unknown) {
  const parsed = applyJobCouponCodeSchema.parse(input);
  const hashedCode = createHash("sha3-256")
    .update(parsed.code.trim())
    .digest("hex");

  if (hashedCode !== COUPON_CODE_HASH) {
    throw new Error("Invalid coupon code");
  }

  const { data: currentJob, error: jobError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", parsed.jobId)
    .single();

  if (jobError) {
    throw new Error("Job posting not found");
  }

  const job = currentJob as JobData;

  if (job.paymentStatus === "paid") {
    throw new Error("Coupon codes can only be applied before payment");
  }

  const fullPrice = getJobPostingPrice(Boolean(job.featured));
  const discountedPrice = fullPrice / 2;

  if (job.payableAmount === discountedPrice) {
    return job;
  }

  if (job.payableAmount !== fullPrice) {
    throw new Error("This listing already has a custom payment amount");
  }

  const { data: updatedJob, error: updateError } = await supabase
    .from("jobs")
    .update({ payableAmount: discountedPrice })
    .eq("id", parsed.jobId)
    .eq("paymentStatus", "unpaid")
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return updatedJob as JobData;
}

export async function finalizeJobPayment(input: unknown) {
  const parsed = finalizeJobPaymentSchema.parse(input);
  const normalizedSigner = getAddress(parsed.signer);

  const { data: currentJob, error: jobError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", parsed.jobId)
    .single();

  if (jobError) {
    throw new Error("Job posting not found");
  }

  const job = currentJob as JobData;

  if (job.paymentStatus === "paid") {
    if (job.transactionHash === parsed.txHash) {
      return job;
    }

    throw new Error("This listing has already been paid for");
  }

  const { data: duplicateTransactions, error: duplicateError } = await supabase
    .from("jobs")
    .select("id")
    .eq("transactionHash", parsed.txHash)
    .neq("id", parsed.jobId);

  if (duplicateError) {
    throw duplicateError;
  }

  if ((duplicateTransactions ?? []).length > 0) {
    throw new Error("This transaction has already been used for another listing");
  }

  const paymentConfig = getChainPaymentConfig(parsed.chainId);
  const publicClient = getPublicClient(parsed.chainId);

  if (!paymentConfig || !publicClient) {
    throw new Error("Unsupported payment network");
  }

  const verificationMessage = getPaymentVerificationMessage({
    jobId: parsed.jobId,
    chainId: parsed.chainId,
    txHash: parsed.txHash as `0x${string}`,
  });
  const recoveredAddress = await recoverMessageAddress({
    message: verificationMessage,
    signature: parsed.signature as `0x${string}`,
  });

  if (!isAddressEqual(recoveredAddress, normalizedSigner)) {
    throw new Error("Payment verification signature does not match the signer");
  }

  const receipt = await publicClient.getTransactionReceipt({
    hash: parsed.txHash as `0x${string}`,
  });

  if (receipt.status !== "success") {
    throw new Error("Transaction was not confirmed successfully");
  }

  const transaction = await publicClient.getTransaction({
    hash: parsed.txHash as `0x${string}`,
  });

  if (!isAddressEqual(transaction.from, normalizedSigner)) {
    throw new Error("Transaction sender does not match the verifying wallet");
  }

  const matchingTransfer = Object.values(paymentConfig.tokens).find((token) => {
    if (!transaction.to || !isAddressEqual(transaction.to, token.address)) {
      return false;
    }

    return receipt.logs.some((log) => {
      if (!isAddressEqual(log.address, token.address)) {
        return false;
      }

      try {
        const decodedLog = decodeEventLog({
          abi: erc20Abi,
          eventName: "Transfer",
          data: log.data,
          topics: log.topics,
        });

        const expectedAmount = parseUnits(
          String(job.payableAmount ?? getJobPostingPrice(Boolean(job.featured))),
          token.decimals
        );

        return (
          isAddressEqual(decodedLog.args.from, normalizedSigner) &&
          isAddressEqual(decodedLog.args.to, PAYMENT_RECIPIENT) &&
          decodedLog.args.value === expectedAmount
        );
      } catch {
        return false;
      }
    });
  });

  if (!matchingTransfer) {
    throw new Error(
      "Transaction does not contain the required stablecoin transfer to the payment address"
    );
  }

  const { data: updatedJob, error: updateError } = await supabase
    .from("jobs")
    .update({
      paymentStatus: "paid",
      transactionHash: parsed.txHash,
      expiryDate: new Date(Date.now() + THIRTY_DAYS_IN_MS).toISOString(),
    })
    .eq("id", parsed.jobId)
    .eq("paymentStatus", "unpaid")
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return updatedJob as JobData;
}
