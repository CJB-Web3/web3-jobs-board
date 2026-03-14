"use client";

import { applyJobCouponCode, finalizeJobPayment } from "@/lib/post-job-actions";
import {
  PAYMENT_RECIPIENT,
  SUPPORTED_PAYMENT_TOKENS,
  SupportedPaymentToken,
  getChainPaymentConfig,
  getJobPostingPrice,
  getPaymentTokenConfig,
  getPaymentVerificationMessage,
  isSupportedPaymentChainId,
} from "@/lib/payment-config";
import { JobData } from "@/lib/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import JobCard from "./JobCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
  Loader2,
  Check,
  X,
  Wallet,
  ExternalLink,
  AlertCircle,
  Mail,
  Home,
  ArrowRight,
  ShieldCheck,
  TicketPercent,
} from "lucide-react";
import { useAppKit, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { useSignMessage, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import Image from "next/image";

const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const;

const TOKEN_LOGOS: Record<SupportedPaymentToken, string> = {
  USDC: "/tokens/usdc-logo.png",
  USDT: "/tokens/usdt-logo.png",
  DAI: "/tokens/dai-logo.png",
};

type Props = {
  job: JobData;
};

type PaymentStep =
  | "connect"
  | "select"
  | "processing"
  | "signing"
  | "verifying"
  | "success"
  | "error";

type SubmittedPayment = {
  chainId: number;
  txHash: `0x${string}`;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong";
}

function getTransactionErrorMessage(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();

  if (message.includes("user denied") || message.includes("rejected")) {
    return "Transaction was cancelled";
  }

  if (message.includes("insufficient")) {
    return "Insufficient wallet balance for the selected payment";
  }

  return "Transaction failed";
}

function getVerificationErrorMessage(error: unknown) {
  const message = getErrorMessage(error);
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("rejected")) {
    return "Payment was sent, but verification was cancelled. Retry verification to publish your listing.";
  }

  if (
    normalizedMessage.includes("not confirmed") ||
    normalizedMessage.includes("not contain")
  ) {
    return "We could not verify the payment yet. If the transfer has already been mined, retry verification in a moment.";
  }

  return message;
}

export default function PaymentCheckoutForm({ job }: Props) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const router = useRouter();
  const normalizedChainId =
    typeof chainId === "string" ? Number(chainId) : chainId;

  const [selectedToken, setSelectedToken] = useState<SupportedPaymentToken>("USDC");
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("connect");
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [submittedPayment, setSubmittedPayment] = useState<SubmittedPayment | null>(
    null
  );
  const [checkoutJob, setCheckoutJob] = useState(job);
  const [finalJobData, setFinalJobData] = useState<JobData | null>(null);

  const verificationAttemptRef = useRef<string | null>(null);

  const { writeContractAsync, isPending: isWriting, reset: resetWrite } =
    useWriteContract();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } =
    useWaitForTransactionReceipt({
      hash: submittedPayment?.txHash,
    });

  const chainPaymentConfig = useMemo(
    () => (normalizedChainId ? getChainPaymentConfig(normalizedChainId) : null),
    [normalizedChainId]
  );

  const selectedTokenConfig = useMemo(
    () =>
      normalizedChainId
        ? getPaymentTokenConfig(normalizedChainId, selectedToken)
        : null,
    [normalizedChainId, selectedToken]
  );

  const activeExplorerUrl = useMemo(() => {
    const explorerChainId = submittedPayment?.chainId ?? normalizedChainId;
    if (!explorerChainId) {
      return "";
    }

    return getChainPaymentConfig(explorerChainId)?.explorerUrl ?? "";
  }, [normalizedChainId, submittedPayment]);

  useEffect(() => {
    setCheckoutJob(job);
  }, [job]);

  const baseAmount = useMemo(
    () => getJobPostingPrice(Boolean(checkoutJob.featured)),
    [checkoutJob.featured]
  );
  const paymentAmount = checkoutJob.payableAmount;
  const couponApplied = paymentAmount < baseAmount;
  const discountAmount = Math.max(baseAmount - paymentAmount, 0);
  const canRetryVerification = Boolean(submittedPayment?.txHash);
  const transactionHash = submittedPayment?.txHash ?? finalJobData?.transactionHash ?? "";
  const canEditCoupon =
    !submittedPayment &&
    paymentStep !== "processing" &&
    paymentStep !== "signing" &&
    paymentStep !== "verifying" &&
    paymentStep !== "success";

  useEffect(() => {
    if (isConnected && paymentStep === "connect") {
      setPaymentStep("select");
    }

    if (!isConnected && !submittedPayment && paymentStep !== "success") {
      setPaymentStep("connect");
    }
  }, [isConnected, paymentStep, submittedPayment]);

  useEffect(() => {
    if (!confirmError || paymentStep === "success") {
      return;
    }

    setError(
      "We could not confirm the transaction yet. If the payment was already sent, retry verification below."
    );
    setPaymentStep("error");
  }, [confirmError, paymentStep]);

  const verifyConfirmedPayment = useCallback(
    async (payment: SubmittedPayment) => {
      if (!address) {
        setError("Reconnect the wallet that sent the payment to finish verification.");
        setPaymentStep("error");
        return;
      }

      try {
        setError("");
        setPaymentStep("signing");

        const signature = await signMessageAsync({
          message: getPaymentVerificationMessage({
            jobId: job.id,
            chainId: payment.chainId,
            txHash: payment.txHash,
          }),
        });

        setPaymentStep("verifying");

        const updatedJob = await finalizeJobPayment({
          jobId: job.id,
          chainId: payment.chainId,
          txHash: payment.txHash,
          signer: address,
          signature,
        });

        setFinalJobData(updatedJob);
        setPaymentStep("success");
      } catch (verificationError) {
        setError(getVerificationErrorMessage(verificationError));
        setPaymentStep("error");
      }
    },
    [address, job.id, signMessageAsync]
  );

  useEffect(() => {
    if (!isConfirmed || !submittedPayment) {
      return;
    }

    if (verificationAttemptRef.current === submittedPayment.txHash) {
      return;
    }

    verificationAttemptRef.current = submittedPayment.txHash;
    void verifyConfirmedPayment(submittedPayment);
  }, [isConfirmed, submittedPayment, verifyConfirmedPayment]);

  const handlePayment = async () => {
    if (!normalizedChainId || !address) {
      setError("Please connect your wallet");
      return;
    }

    if (!isSupportedPaymentChainId(normalizedChainId) || !chainPaymentConfig) {
      setError("Please switch to a supported network");
      return;
    }

    if (!selectedTokenConfig) {
      setError("Token not supported on this network");
      return;
    }

    try {
      setError("");
      setPaymentStep("processing");
      verificationAttemptRef.current = null;

      const txHash = await writeContractAsync({
        address: selectedTokenConfig.address,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [
          PAYMENT_RECIPIENT as `0x${string}`,
          parseUnits(String(paymentAmount), selectedTokenConfig.decimals),
        ],
      });

      setSubmittedPayment({
        chainId: normalizedChainId,
        txHash,
      });
    } catch (paymentError) {
      setSubmittedPayment(null);
      setError(getTransactionErrorMessage(paymentError));
      setPaymentStep("error");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponFeedback("Enter a coupon code to apply the discount.");
      return;
    }

    try {
      setCouponFeedback("");
      setIsApplyingCoupon(true);

      const updatedJob = await applyJobCouponCode({
        jobId: checkoutJob.id,
        code: couponCode,
      });

      setCheckoutJob(updatedJob);
      setCouponFeedback("Coupon applied. Your total has been reduced by 50%.");
    } catch (couponError) {
      setCouponFeedback(getErrorMessage(couponError));
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const retryVerification = async () => {
    if (!submittedPayment) {
      return;
    }

    verificationAttemptRef.current = submittedPayment.txHash;
    await verifyConfirmedPayment(submittedPayment);
  };

  const resetCheckout = () => {
    setError("");
    setSubmittedPayment(null);
    setPaymentStep(isConnected ? "select" : "connect");
    verificationAttemptRef.current = null;
    resetWrite();
  };

  const isCorrectNetwork = Boolean(chainPaymentConfig);

  return (
    <div className="max-w-2xl mx-auto border border-foreground">
      <div className="bg-foreground text-background px-6 py-4">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-background/60 mb-1">
          ■ Step 5 — Checkout
        </p>
        <h2 className="font-headline text-2xl font-black uppercase tracking-tight flex gap-2 items-center">
          <Wallet className="h-6 w-6" />
          Payment Checkout
        </h2>
        <p className="font-sans text-[10px] uppercase tracking-widest text-background/60 mt-1">
          Pay securely with stablecoins on multiple networks
        </p>
      </div>

      <div className="space-y-5 p-6">
        {paymentStep !== "success" && (
          <>
            <JobCard job={checkoutJob} hideFooter={true} />
            <Separator />
          </>
        )}

        <div className="border border-foreground p-4">
          <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Order Summary
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm">Plan Type</span>
              <Badge
                className="rounded-none border-foreground"
                variant={checkoutJob.featured ? "default" : "outline"}
              >
                {checkoutJob.featured ? "Featured" : "Basic"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm">Duration</span>
              <span className="font-sans text-sm">30 days</span>
            </div>
            <div className="h-px bg-foreground my-2" />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TicketPercent className="h-4 w-4 text-foreground" />
                <span className="font-body text-sm">Coupon Code</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Enter coupon code"
                  disabled={!canEditCoupon || couponApplied || isApplyingCoupon}
                  className="rounded-none"
                />
                <Button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={!canEditCoupon || couponApplied || isApplyingCoupon}
                  variant="outline"
                  className="sm:w-auto"
                >
                  {isApplyingCoupon ? (
                    <>
                      Applying
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : couponApplied ? (
                    "Applied"
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              {couponFeedback && (
                <p
                  className={`text-xs ${
                    couponApplied ? "text-foreground" : "text-[#CC0000]"
                  }`}
                >
                  {couponFeedback}
                </p>
              )}
            </div>
            <div className="h-px bg-foreground my-2" />
            {couponApplied && (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm">Subtotal</span>
                  <span className="font-sans text-sm">
                    {baseAmount} {selectedToken}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#CC0000]">
                  <span className="font-body text-sm">Coupon Discount</span>
                  <span className="font-sans text-sm">- {discountAmount} {selectedToken}</span>
                </div>
                <div className="h-px bg-foreground my-2" />
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="font-body font-medium">Total</span>
              <span className="font-headline text-xl font-bold">
                {paymentAmount} {selectedToken}
              </span>
            </div>
          </div>
        </div>

        {paymentStep !== "success" && (
          <div className="border border-foreground p-4 bg-muted/20">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
              <p className="font-body text-sm text-foreground">
                For fiat payment or bulk listings, contact us at{" "}
                <a
                  href="mailto:contact@web3jobsboard.com"
                  className="underline decoration-[#CC0000] hover:text-[#CC0000] transition-colors duration-200"
                >
                  contact@web3jobsboard.com
                </a>
              </p>
            </div>
          </div>
        )}

        {paymentStep === "connect" && (
          <div className="text-center space-y-5 py-8 border border-foreground p-6">
            <div className="w-16 h-16 border-2 border-foreground flex items-center justify-center mx-auto">
              <Wallet className="h-8 w-8 text-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-headline text-xl font-black uppercase tracking-tight">
                Connect Your Wallet
              </h3>
              <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto">
                Connect your wallet to proceed. We support MetaMask, WalletConnect,
                and other popular wallets.
              </p>
            </div>
            <Button onClick={() => open()} size="lg" className="min-w-[200px]">
              Connect Wallet
            </Button>
          </div>
        )}

        {paymentStep === "select" && isConnected && (
          <div className="space-y-4">
            <div className="border border-foreground p-4 bg-muted/10">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-sans text-[9px] uppercase tracking-widest text-muted-foreground">
                    Connected Wallet
                  </p>
                  <p className="font-mono text-xs mt-1">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground mt-1">
                    Network: {chainPaymentConfig?.name ?? "Unknown Network"}
                  </p>
                </div>
              </div>
            </div>

            {!isCorrectNetwork && (
              <div className="border-2 border-foreground p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-sans text-[9px] uppercase tracking-widest mb-1">
                      Wrong Network
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      Please switch to a supported network:
                    </p>
                    <ul className="font-sans text-[10px] mt-2 space-y-1 text-muted-foreground">
                      <li>· Ethereum</li>
                      <li>· Polygon</li>
                      <li>· BNB Smart Chain</li>
                      <li>· Base</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {isCorrectNetwork && (
              <>
                <div>
                  <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                    Select Payment Token
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {SUPPORTED_PAYMENT_TOKENS.map((token) => (
                      <button
                        key={token}
                        onClick={() => setSelectedToken(token)}
                        className={`relative p-4 border-2 transition-all duration-200 ${
                          selectedToken === token
                            ? "border-foreground bg-foreground text-background"
                            : "border-muted-foreground hover:border-foreground"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Image
                            src={TOKEN_LOGOS[token]}
                            alt={token}
                            width={36}
                            height={36}
                            className={`${
                              selectedToken === token
                                ? "grayscale invert"
                                : "grayscale"
                            }`}
                          />
                          <span className="font-sans text-[10px] uppercase tracking-widest">
                            {token}
                          </span>
                        </div>
                        {selectedToken === token && (
                          <div className="absolute top-1.5 right-1.5">
                            <div className="w-4 h-4 bg-background flex items-center justify-center">
                              <Check className="h-3 w-3 text-foreground" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border border-foreground p-4 bg-muted/20">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-4 w-4 text-foreground flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-sans text-[10px] uppercase tracking-widest">
                        Ready to pay {paymentAmount} {selectedToken} on {chainPaymentConfig?.name}
                      </p>
                      <p className="font-body text-xs text-muted-foreground">
                        After the transfer confirms, we will ask for one wallet
                        signature to bind the payment to this listing.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {(paymentStep === "processing" ||
          paymentStep === "signing" ||
          paymentStep === "verifying" ||
          isWriting ||
          isConfirming ||
          isSigning) && (
          <div className="text-center space-y-5 py-8 border border-foreground p-6">
            <div className="w-16 h-16 border-2 border-foreground flex items-center justify-center mx-auto">
              <Loader2 className="h-8 w-8 text-foreground animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="font-headline text-xl font-black uppercase tracking-tight">
                {isWriting || paymentStep === "processing"
                  ? "Confirming Transaction"
                  : isConfirming
                  ? "Processing Payment"
                  : paymentStep === "signing" || isSigning
                  ? "Verify Payment"
                  : "Publishing Listing"}
              </h3>
              <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto">
                {isWriting || paymentStep === "processing"
                  ? "Please confirm the token transfer in your wallet."
                  : isConfirming
                  ? "Waiting for blockchain confirmation..."
                  : paymentStep === "signing" || isSigning
                  ? "Sign the verification message to link this payment to your listing."
                  : "Verifying the payment and publishing your listing..."}
              </p>
              {transactionHash && (
                <p className="font-sans text-[10px] text-muted-foreground mt-4">
                  Transaction: {transactionHash.slice(0, 10)}...
                  {transactionHash.slice(-8)}
                </p>
              )}
            </div>
          </div>
        )}

        {paymentStep === "success" && finalJobData && (
          <div className="space-y-5">
            <div className="bg-foreground text-background p-6 text-center space-y-3">
              <div className="w-14 h-14 border-2 border-background flex items-center justify-center mx-auto">
                <Check className="h-7 w-7 text-background" />
              </div>
              <div>
                <h3 className="font-headline text-2xl font-black uppercase tracking-tight">
                  Payment Verified
                </h3>
                <p className="font-sans text-[10px] uppercase tracking-widest text-background/70 mt-1">
                  Your listing is now live and visible to candidates
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-foreground p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                    Transaction Complete
                  </p>
                  <Check className="h-4 w-4 text-foreground" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-muted-foreground">
                      Amount Paid
                    </span>
                    <div className="flex items-center gap-2">
                      <Image
                        src={TOKEN_LOGOS[selectedToken]}
                        alt={selectedToken}
                        width={18}
                        height={18}
                        className="grayscale"
                      />
                      <span className="font-sans text-sm font-bold">
                        {paymentAmount} {selectedToken}
                      </span>
                    </div>
                  </div>
                  <div className="h-px bg-muted" />
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-muted-foreground">
                      Network
                    </span>
                    <span className="font-sans text-sm">
                      {getChainPaymentConfig(
                        submittedPayment?.chainId ?? normalizedChainId ?? 0
                      )?.name}
                    </span>
                  </div>
                  {transactionHash && activeExplorerUrl && (
                    <>
                      <div className="h-px bg-muted" />
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">
                          Transaction
                        </span>
                        <a
                          href={`${activeExplorerUrl}/tx/${transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[10px] inline-flex items-center gap-1 underline decoration-[#CC0000] hover:text-[#CC0000] transition-colors duration-200"
                        >
                          {transactionHash.slice(0, 8)}...{transactionHash.slice(-6)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={() => router.push(`/job-details/${finalJobData.id}`)}
                  size="lg"
                  className="flex-1"
                >
                  View Your Job
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        )}

        {paymentStep === "error" && (
          <div className="text-center space-y-5 py-8 border-2 border-foreground p-6">
            <div className="w-16 h-16 border-2 border-foreground flex items-center justify-center mx-auto">
              <X className="h-8 w-8 text-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-headline text-xl font-black uppercase tracking-tight">
                Verification Incomplete
              </h3>
              <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto break-words">
                {error || "The payment could not be verified. Please try again."}
              </p>
              <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
                {canRetryVerification
                  ? "If your payment already went through, retry verification."
                  : "Check your token balance and gas funds."}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-foreground px-6 py-4">
        {paymentStep === "select" && isCorrectNetwork && (
          <Button
            onClick={handlePayment}
            disabled={!isConnected || !selectedToken}
            className="w-full"
            size="lg"
          >
            Confirm Payment
          </Button>
        )}

        {paymentStep === "error" && (
          <div className="flex flex-col md:flex-row w-full gap-3">
            {canRetryVerification ? (
              <Button onClick={retryVerification} className="w-full" size="lg">
                Retry Verification
              </Button>
            ) : (
              <Button
                onClick={resetCheckout}
                variant="default"
                className="w-full"
                size="lg"
              >
                Try Again
              </Button>
            )}

            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Go Home
            </Button>
          </div>
        )}

        {(paymentStep === "processing" ||
          paymentStep === "signing" ||
          paymentStep === "verifying" ||
          isWriting ||
          isConfirming ||
          isSigning) && (
          <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground text-center">
            Do not close this window or refresh the page
          </p>
        )}
      </div>
    </div>
  );
}
