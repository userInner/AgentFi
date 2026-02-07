"use client";

import { useAppKit } from "@reown/appkit/react";
import { useSiweAuth } from "@/hooks/use-siwe-auth";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function SettingsPage() {
  const { open } = useAppKit();
  const { isConnected, isAuthenticated, isSigningIn, address, signIn, logout } = useSiweAuth();

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">设置</h2>
        <p className="text-[13px] text-muted mt-0.5">账户和平台配置</p>
      </div>

      {/* Wallet */}
      <section className="border border-border rounded-lg p-5 space-y-4">
        <h3 className="text-[13px] font-medium text-foreground">钱包连接</h3>

        {!isConnected ? (
          <div className="flex items-center justify-between p-3 rounded-md border border-border">
            <div>
              <p className="text-[13px] text-foreground">连接你的钱包</p>
              <p className="text-[11px] text-muted mt-0.5">支持 MetaMask、Rainbow、WalletConnect 等</p>
            </div>
            <button
              onClick={() => open()}
              className="px-4 py-1.5 border border-border-strong text-[12px] text-foreground rounded-md hover:bg-white/[0.04] transition-colors"
            >
              连接
            </button>
          </div>
        ) : !isAuthenticated ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-md border border-profit/20 bg-profit/5">
              <div>
                <p className="text-[13px] text-foreground">钱包已连接</p>
                <p className="text-[11px] font-mono text-muted mt-0.5">{address && truncateAddress(address)}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-profit" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border border-border">
              <div>
                <p className="text-[13px] text-foreground">签名验证身份</p>
                <p className="text-[11px] text-muted mt-0.5">使用 SIWE 签名登录，不消耗 Gas</p>
              </div>
              <button
                onClick={signIn}
                disabled={isSigningIn}
                className="px-4 py-1.5 border border-accent/30 text-[12px] text-accent rounded-md hover:bg-accent/10 transition-colors disabled:opacity-50"
              >
                {isSigningIn ? "签名中..." : "签名登录"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-md border border-profit/20 bg-profit/5">
              <div>
                <p className="text-[13px] text-foreground">已认证</p>
                <p className="text-[11px] font-mono text-muted mt-0.5">{address && truncateAddress(address)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-profit">SIWE 已验证</span>
                <span className="w-2 h-2 rounded-full bg-profit" />
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-1.5 border border-border text-[12px] text-muted rounded-md hover:text-loss hover:border-loss/30 transition-colors"
            >
              断开连接
            </button>
          </div>
        )}
      </section>

      {/* API Config */}
      <section className="border border-border rounded-lg p-5 space-y-4">
        <h3 className="text-[13px] font-medium text-foreground">API 配置</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">Hyperliquid API Key</label>
            <input
              type="password"
              placeholder="输入你的 API Key"
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px] text-foreground placeholder:text-muted-light focus:outline-none focus:border-border-strong transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] text-muted uppercase tracking-wider mb-1.5">API Secret</label>
            <input
              type="password"
              placeholder="输入你的 API Secret"
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px] text-foreground placeholder:text-muted-light focus:outline-none focus:border-border-strong transition-colors"
            />
          </div>
        </div>
        <button className="px-4 py-1.5 border border-border-strong text-[12px] text-foreground rounded-md hover:bg-white/[0.04] transition-colors">
          保存
        </button>
      </section>

      {/* Notifications */}
      <section className="border border-border rounded-lg p-5 space-y-3">
        <h3 className="text-[13px] font-medium text-foreground">通知设置</h3>
        {["交易执行通知", "盈亏预警", "机器人状态变更", "新投资者加入"].map((item) => (
          <label key={item} className="flex items-center justify-between p-3 rounded-md border border-border cursor-pointer hover:border-border-strong transition-colors">
            <span className="text-[13px]">{item}</span>
            <div className="w-8 h-[18px] bg-white/[0.08] rounded-full relative">
              <div className="w-3.5 h-3.5 bg-muted rounded-full absolute top-[2px] right-[2px] transition-all" />
            </div>
          </label>
        ))}
      </section>
    </div>
  );
}
