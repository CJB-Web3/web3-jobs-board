import { base, bsc, mainnet, polygon } from "viem/chains";

export const PAYMENT_RECIPIENT = "0xC2fB6Fda15D59a927741bf39b097451037fD3D41";

export const JOB_POSTING_PRICES = {
  basic: 80,
  featured: 150,
} as const;

export const SUPPORTED_PAYMENT_TOKENS = ["USDC", "USDT", "DAI"] as const;

export type SupportedPaymentToken = (typeof SUPPORTED_PAYMENT_TOKENS)[number];

export type SupportedPaymentChainId =
  | typeof mainnet.id
  | typeof polygon.id
  | typeof bsc.id
  | typeof base.id;

type TokenConfig = {
  address: `0x${string}`;
  decimals: number;
};

type ChainPaymentConfig = {
  id: SupportedPaymentChainId;
  name: string;
  explorerUrl: string;
  tokens: {
    usdc: TokenConfig;
    usdt: TokenConfig;
    dai: TokenConfig;
  };
};

export const PAYMENT_CHAIN_CONFIG: Record<
  SupportedPaymentChainId,
  ChainPaymentConfig
> = {
  [mainnet.id]: {
    id: mainnet.id,
    name: "Ethereum",
    explorerUrl: "https://etherscan.io",
    tokens: {
      usdc: {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
      },
      usdt: {
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: 6,
      },
      dai: {
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        decimals: 18,
      },
    },
  },
  [polygon.id]: {
    id: polygon.id,
    name: "Polygon",
    explorerUrl: "https://polygonscan.com",
    tokens: {
      usdc: {
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        decimals: 6,
      },
      usdt: {
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        decimals: 6,
      },
      dai: {
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        decimals: 18,
      },
    },
  },
  [bsc.id]: {
    id: bsc.id,
    name: "BNB Smart Chain",
    explorerUrl: "https://bscscan.com",
    tokens: {
      usdc: {
        address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        decimals: 18,
      },
      usdt: {
        address: "0x55d398326f99059fF775485246999027B3197955",
        decimals: 18,
      },
      dai: {
        address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
        decimals: 18,
      },
    },
  },
  [base.id]: {
    id: base.id,
    name: "Base",
    explorerUrl: "https://basescan.org",
    tokens: {
      usdc: {
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        decimals: 6,
      },
      usdt: {
        address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
        decimals: 18,
      },
      dai: {
        address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
        decimals: 18,
      },
    },
  },
};

export const SUPPORTED_PAYMENT_CHAIN_IDS = Object.keys(
  PAYMENT_CHAIN_CONFIG
).map((chainId) => Number(chainId) as SupportedPaymentChainId);

export function isSupportedPaymentChainId(
  chainId: number
): chainId is SupportedPaymentChainId {
  return chainId in PAYMENT_CHAIN_CONFIG;
}

export function getJobPostingPrice(featured: boolean) {
  return featured ? JOB_POSTING_PRICES.featured : JOB_POSTING_PRICES.basic;
}

export function getChainPaymentConfig(chainId: number) {
  if (!isSupportedPaymentChainId(chainId)) {
    return null;
  }

  return PAYMENT_CHAIN_CONFIG[chainId];
}

export function getPaymentTokenConfig(
  chainId: number,
  token: SupportedPaymentToken
) {
  const chainConfig = getChainPaymentConfig(chainId);
  if (!chainConfig) {
    return null;
  }

  return chainConfig.tokens[token.toLowerCase() as keyof ChainPaymentConfig["tokens"]];
}

export function getPaymentVerificationMessage(input: {
  jobId: number;
  chainId: number;
  txHash: `0x${string}`;
}) {
  return [
    "Web3 Jobs Board payment verification",
    "",
    `Job ID: ${input.jobId}`,
    `Chain ID: ${input.chainId}`,
    `Transaction Hash: ${input.txHash}`,
    `Recipient: ${PAYMENT_RECIPIENT}`,
    "",
    "Sign this message to publish the job listing tied to this payment.",
  ].join("\n");
}
