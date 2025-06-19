"use client";
import { JobData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
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
import { Loader2, Check, X, Wallet, ExternalLink, AlertCircle, Mail, Home, Eye, ArrowRight } from "lucide-react";
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { updateJobPaymentStatus } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { mainnet, polygon, bsc, base } from '@reown/appkit/networks';
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Spline_Sans } from "next/font/google"; // Import Spline_Sans

// Initialize Spline Sans font
const spline_sans = Spline_Sans({ subsets: ["latin"], weight: "500" });
const spline_sans_reg = Spline_Sans({ subsets: ["latin"], weight: "400" });

// ERC20 ABI for transfer function
const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }]
  },
  {
    name: 'decimals',
    type: 'function',
    inputs: [],
    outputs: [{ type: 'uint8' }]
  },
  {
    name: 'symbol',
    type: 'function',
    inputs: [],
    outputs: [{ type: 'string' }]
  }
] as const;

type Props = {
  job: JobData;
};

const PAYMENT_RECIPIENT = "0x14fBE93b2E284bd255001390B6D40AE43dda1952";

const SUPPORTED_TOKENS = ['USDC', 'USDT', 'DAI'] as const;
type SupportedToken = typeof SUPPORTED_TOKENS[number];

const TOKEN_LOGOS: Record<SupportedToken, string> = {
  USDC: "/tokens/usdc-logo.png",
  USDT: "/tokens/usdt-logo.png",
  DAI: "/tokens/dai-logo.png"
};

// Mainnet token addresses
const TOKEN_ADDRESSES = {
  // Ethereum Mainnet
  [mainnet.id]: {
    usdc: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
    usdt: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
    dai: { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 }
  },
  // Polygon Mainnet
  [polygon.id]: {
    usdc: { address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6 },
    usdt: { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },
    dai: { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18 }
  },
  // BNB Smart Chain
  [bsc.id]: {
    usdc: { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18 },
    usdt: { address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },
    dai: { address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', decimals: 18 }
  },
  // Base Mainnet
  [base.id]: {
    usdc: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },
    usdt: { address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', decimals: 18 },
    dai: { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18 }
  }
};

export default function PaymentCheckoutForm({ job }: Props) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const router = useRouter();

  const [selectedToken, setSelectedToken] = useState<SupportedToken>('USDC');
  const [paymentStep, setPaymentStep] = useState<'connect' | 'select' | 'pay' | 'processing' | 'success' | 'error'>('connect');
  const [error, setError] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [finalJobData, setFinalJobData] = useState<JobData | null>(null);

  const { data: hash, writeContractAsync, isPending: isWriting, reset: resetWrite } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  });

  // Get token contract address for current chain
  const getTokenAddress = () => {
    if (!chainId || !TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]) return null;
    const tokenKey = selectedToken.toLowerCase() as 'usdc' | 'usdt' | 'dai';
    return TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES][tokenKey]?.address;
  };

  const getTokenDecimals = () => {
    if (!chainId || !TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]) return 6;
    const tokenKey = selectedToken.toLowerCase() as 'usdc' | 'usdt' | 'dai';
    return TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES][tokenKey]?.decimals || 6;
  };

  // Get payment amount based on package
  const getPaymentAmount = () => {
      return job.featured ? 150 : 80;
  };

  useEffect(() => {
    if (isConnected && paymentStep === 'connect') {
      setPaymentStep('select');
    }
  }, [isConnected, paymentStep]);

  useEffect(() => {
    if (isSuccess && hash) {
      setTxHash(hash);
      handlePaymentSuccess(hash);
    }
  }, [isSuccess, hash]);

  // Handle confirmation errors
  useEffect(() => {
    if (confirmError) {
      setError('Transaction failed during confirmation');
      setPaymentStep('error');
    }
  }, [confirmError]);

  const handlePaymentSuccess = async (transactionHash: string) => {
    setPaymentStep('success');

    try {
      // Update job status in database
      const updatedJob = await updateJobPaymentStatus(job.id, transactionHash);
      setFinalJobData(updatedJob || job);
    } catch (err) {
      // Still show success since payment went through
      setFinalJobData(job);
    }
  };

  const handlePayment = async () => {
    if (!chainId || !address) {
      setError('Please connect your wallet');
      return;
    }

    const tokenAddress = getTokenAddress();
    if (!tokenAddress) {
      setError('Token not supported on this network');
      return;
    }

    const decimals = getTokenDecimals();
    const amount = parseUnits(getPaymentAmount().toString(), decimals);

    try {
      setError('');
      setPaymentStep('processing');

      // Use writeContractAsync and properly catch errors
      const txHash = await writeContractAsync({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [PAYMENT_RECIPIENT as `0x${string}`, amount],
      }).catch((err) => {
        // Handle user rejection
        if (err.message?.includes('User denied') || err.message?.includes('User rejected') || err.message?.includes('rejected')) {
          throw new Error('Transaction was cancelled');
        }
        // Handle other errors
        if (err.message?.includes('insufficient funds')) {
          throw new Error('Insufficient funds in wallet');
        }
        throw new Error('Transaction failed');
      });

    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      setPaymentStep('error');
    }
  };

  const getNetworkName = () => {
    switch (chainId) {
      case mainnet.id: return 'Ethereum';
      case polygon.id: return 'Polygon';
      case bsc.id: return 'BNB Smart Chain';
      case base.id: return 'Base';
      default: return 'Unknown Network';
    }
  };

  const isCorrectNetwork = () => {
    if(chainId == mainnet.id || chainId == polygon.id || chainId == bsc.id || chainId == base.id) {
      return true;
    } else {
      return false;
    }
  };

  const getBlockExplorerUrl = () => {
    switch (chainId) {
      case mainnet.id: return 'https://etherscan.io';
      case polygon.id: return 'https://polygonscan.com';
      case bsc.id: return 'https://bscscan.com';
      case base.id: return 'https://basescan.org';
      default: return '';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border dark:border-primary shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className={`text-2xl font-bold flex items-center gap-2 ${spline_sans.className}`}> {/* Applied Spline Sans */}
          <Wallet className="h-6 w-6" />
          Payment Checkout
        </CardTitle>
        <CardDescription className="text-purple-100">
          Pay securely with stablecoins on multiple networks
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {paymentStep !== 'success' && (
          <>
            <JobCard job={job} hideFooter={true} />
            <Separator />
          </>
        )}

        <div className="space-y-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-600 dark:text-gray-400">
            Order Summary
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Plan Type</span>
              <Badge className="rounded-sm" variant={job.featured ? "default" : "outline"}>
                {job.featured ? "Featured" : "Basic"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Duration</span>
              <span className={`${spline_sans_reg.className}`}>30 days</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className={`text-xl ${spline_sans_reg.className}`}> 
                {getPaymentAmount()} {selectedToken}
              </span>
            </div>
          </div>
        </div>

        {/* Fiat payment message */}
        {paymentStep !== 'success' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-600 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  For fiat payment options or bulk job listings, please contact us at{' '}
                  <a href="mailto:contact@web3jobsboard.com" className="font-medium underline">
                    contact@web3jobsboard.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {paymentStep === 'connect' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto">
              <Wallet className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Connect your wallet to proceed with the payment. We support MetaMask, WalletConnect, and other popular wallets.
              </p>
            </div>
            <Button onClick={() => open()} size="lg" className="min-w-[200px]">
              Connect Wallet
            </Button>
          </div>
        )}

        {paymentStep === 'select' && isConnected && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">Connected Wallet</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Network: {getNetworkName()}
                  </p>
                </div>
              </div>
            </div>

            {!isCorrectNetwork() && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-yellow-900 dark:text-yellow-100">Wrong Network</h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Please switch to one of these supported networks:
                    </p>
                    <ul className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 space-y-1">
                      <li>• Ethereum</li>
                      <li>• Polygon</li>
                      <li>• BNB Smart Chain</li>
                      <li>• Base</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {isCorrectNetwork() && (
              <>
                <div>
                  <h4 className="font-medium mb-3">Select Payment Token</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {SUPPORTED_TOKENS.map((token) => (
                      <button
                        key={token}
                        onClick={() => setSelectedToken(token)}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          selectedToken === token
                            ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Image
                            src={TOKEN_LOGOS[token]}
                            alt={token}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <span className="font-medium text-sm">{token}</span>
                        </div>
                        {selectedToken === token && (
                          <div className="absolute top-2 right-2">
                            <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div className="flex-1">
                      <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                        Ready to pay {getPaymentAmount()} {selectedToken} on {getNetworkName()}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {(paymentStep === 'processing' || isWriting || isConfirming) && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="h-10 w-10 text-purple-600 dark:text-purple-400 animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                {isWriting ? 'Confirming Transaction' :
                  isConfirming ? 'Processing Payment' :
                  'Initializing...'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {isWriting ? 'Please confirm the transaction in your wallet' :
                  isConfirming ? 'Waiting for blockchain confirmation...' :
                  'Please wait...'}
              </p>
              {hash && (
                <p className="text-xs text-muted-foreground mt-4">
                  Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
                </p>
              )}
            </div>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="space-y-6">
            <div className="text-center space-y-4 py-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-scale-in shadow-lg">
                <Check className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-2xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  Payment Successful!
                </h3>
                <p className="text-muted-foreground">
                  Your job listing is now live and visible to thousands of candidates
                </p>
              </div>
            </div>

            {finalJobData && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Transaction Complete</h4>
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Amount Paid</span>
                      <div className="flex items-center gap-2">
                        <Image
                          src={TOKEN_LOGOS[selectedToken]}
                          alt={selectedToken}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span className="font-medium">{getPaymentAmount()} {selectedToken}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Network</span>
                      <span className="text-sm font-medium">{getNetworkName()}</span>
                    </div>
                    {txHash && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Transaction</span>
                        <a
                          href={`${getBlockExplorerUrl()}/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                        >
                          {txHash.slice(0, 8)}...{txHash.slice(-6)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-4">
                  <Button
                    onClick={() => router.push(`/job-details/${finalJobData.id}`)}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md"
                  >
                    View Your Job
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                    size="lg"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {paymentStep === 'error' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <X className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Payment Failed</h3>
              <div className="max-w-sm mx-auto">
                <p className="text-sm text-red-600 dark:text-red-400 break-words">
                  {error || 'The transaction failed. Please try again.'}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Make sure you have enough tokens and gas in your wallet.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="rounded-b-lg">
        {paymentStep === 'select' && isCorrectNetwork() && (
          <Button
            onClick={handlePayment}
            disabled={!isConnected || !selectedToken}
            className={`w-full ${spline_sans_reg.className}`}
            size="lg"
          >
            Confirm Payment
          </Button>
        )}

        {paymentStep === 'error' && (
          <div className="flex flex-col md:flex-row w-full space-y-3 md:space-y-0 md:space-x-3">
            <Button
              onClick={() => {
                setPaymentStep('select');
                setError('');
                resetWrite();
              }}
              variant="default"
              className="w-full"
              size="lg"
            >
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Start Over
            </Button>
          </div>
        )}

        {(paymentStep === 'processing' || isWriting || isConfirming) && (
          <div className="w-full text-center">
            <p className="text-xs text-muted-foreground">
              Do not close this window or refresh the page
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
