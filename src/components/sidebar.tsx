"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppKit } from "@reown/appkit/react";
import { useSiweAuth } from "@/hooks/use-siwe-auth";
import { usePlatformStore } from "@/store/use-platform-store";
import { fmtUsd } from "@/lib/format";

const navItems = [
  { href: "/", label: "仪表盘", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  )},
  { href: "/bots", label: "交易机器人", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M9 15h0"/><path d="M15 15h0"/></svg>
  )},
  { href: "/invest", label: "执行中心", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  )},
  { href: "/portfolio", label: "决策日志", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  )},
  { href: "/settings", label: "设置", icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  )},
];

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function Sidebar() {
  const pathname = usePathname();
  const { open } = useAppKit();
  const { isConnected, isAuthenticated, isSigningIn, address, signIn, logout } = useSiweAuth();
  const userBalance = usePlatformStore((s) => s.userBalance);

  const handleConnect = () => {
    if (!isConnected) {
      open();
    } else if (!isAuthenticated) {
      signIn();
    }
  };

  return (
    <aside className="w-52 shrink-0 border-r border-border bg-card/50 flex flex-col backdrop-blur-sm">
      <div className="px-5 py-5 border-b border-border">
        <h1 className="text-base font-semibold tracking-tight text-foreground">AgentFi</h1>
        <p className="text-[11px] text-muted mt-0.5 tracking-wide">Trading Platform</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors ${
                isActive
                  ? "text-foreground bg-white/[0.06]"
                  : "text-muted hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              <span className="opacity-70">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border space-y-2">
        {isConnected && isAuthenticated && address ? (
          <>
            <div className="px-3">
              <p className="text-[11px] text-muted uppercase tracking-wider">余额</p>
              <p className="text-sm font-mono font-medium text-foreground">{fmtUsd(userBalance)}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-muted hover:text-foreground hover:bg-white/[0.03] transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-profit/20 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-profit" />
              </div>
              <span className="font-mono text-[11px] truncate">{truncateAddress(address)}</span>
            </button>
          </>
        ) : isConnected && !isAuthenticated ? (
          <button
            onClick={signIn}
            disabled={isSigningIn}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-accent hover:bg-white/[0.03] transition-colors disabled:opacity-50"
          >
            <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            </div>
            <span>{isSigningIn ? "签名中..." : "签名登录"}</span>
          </button>
        ) : (
          <button
            onClick={handleConnect}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-muted hover:text-foreground hover:bg-white/[0.03] transition-colors"
          >
            <div className="w-5 h-5 rounded-full border border-border-strong flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <span>连接钱包</span>
          </button>
        )}
      </div>
    </aside>
  );
}
