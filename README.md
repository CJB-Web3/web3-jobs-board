# Web3 Jobs Board

A modern job board for Web3 hiring, built with Next.js, Supabase, Wagmi/AppKit, and stablecoin checkout.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS + Radix UI
- Supabase for job storage and company assets
- Wagmi + Reown AppKit for wallet connectivity
- Stablecoin payments on Ethereum, Polygon, BNB Smart Chain, and Base

## Local Development

1. Install dependencies with `pnpm install`.
2. Create `.env.local` with the required environment variables.
3. Start the dev server with `pnpm dev`.

## Required Environment Variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

Optional:

- `NEXT_PUBLIC_SITE_URL`

## Payment Flow

- Job posts are created in the database as `unpaid`.
- Checkout transfers `USDC`, `USDT`, or `DAI` to `0xC2fB6Fda15D59a927741bf39b097451037fD3D41`.
- After the transfer confirms, the poster signs a verification message.
- The server verifies the chain, token contract, recipient, amount, tx sender, and signature before marking the listing as `paid`.
- Only paid and unexpired listings are shown publicly.

## Quality Checks

- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
