"use client";

import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type Config } from "wagmi";
import { createAppKit } from "@reown/appkit/react";
import { wagmiAdapter, projectId, networks } from "@/lib/wagmi-config";
import { mainnet } from "wagmi/chains";

const queryClient = new QueryClient();

// 初始化 AppKit
const metadata = {
  name: "AgentFi",
  description: "AI Trading Platform on Hyperliquid",
  url: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  icons: ["/icon.png"],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [networks[0], ...networks.slice(1)],
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: false,
  },
  allowUnsupportedChain: true,
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
