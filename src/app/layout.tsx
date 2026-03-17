import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { TickerProvider } from "@/components/ticker-provider";
import { Providers } from "@/components/providers";
import { WalletSync } from "@/components/wallet-sync";

export const metadata: Metadata = {
  title: "AgentFi - AI Trading Platform",
  description: "AI-powered trading bots on Hyperliquid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Providers>
          <WalletSync />
          <TickerProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
          </TickerProvider>
        </Providers>
      </body>
    </html>
  );
}
