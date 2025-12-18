"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Wallet owner configuration for access control
// You can set these environment variables in your .env.local file:
// NEXT_PUBLIC_KOM_OWNER_WALLETS=0x1234...,0x5678...
// NEXT_PUBLIC_BBA_OWNER_WALLETS=0xabcd...,0xefgh...
export const WALLET_OWNERS = {
  KOM: process.env.NEXT_PUBLIC_KOM_OWNER_WALLETS?.split(",").filter(
    Boolean
  ) || [
    "0x91472E17C35e0674236E369f13f161990C656686", // Replace with actual KOM owner wallet
    // "0x3d9a6cB7bae3dDfC058c16B7BBC47E706DD3dAfA", // Add more KOM owner wallets as needed
    "0xea5108f56c24872f5d29DA85Ec04EA071F6D9476",
    "0xe6a7b46A6288D6f939674C4652cf1C2BB9746e2E",
    "0x64B76C6A8030aEE37Ea07Fa03aE87478Fc574846",
  ],
  BBA: process.env.NEXT_PUBLIC_BBA_OWNER_WALLETS?.split(",").filter(
    Boolean
  ) || [
    "0x91472E17C35e0674236E369f13f161990C656686", // Replace with actual BBA owner wallet
    "0x3d9a6cB7bae3dDfC058c16B7BBC47E706DD3dAfA",
    "0xDC4F5f571a67ceBed99C10A3a621487ddcf88eDe", // Add more BBA owner wallets as needed
    "0xea5108f56c24872f5d29DA85Ec04EA071F6D9476",
    "0x9f5b55a6727691E18b883Fc5d30725E7bb125C92",
    "0x4C75ce67fc46BDd12aaC1ae74A26C8C9c9Bf4E74",
  ],
} as const;

export type ExchangeType = keyof typeof WALLET_OWNERS;

const config = getDefaultConfig({
  appName: "Liquidex",
  projectId: "43ee1447e6a6b87c341130fb67700aff",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
const queryClient = new QueryClient();

export default function WalletConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
