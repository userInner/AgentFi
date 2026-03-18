"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useSiweAuth } from "@/hooks/use-siwe-auth";
import { fmtTime } from "@/lib/format";
import { usePlatformStore } from "@/store/use-platform-store";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function SettingsPage() {
  const { open } = useAppKit();
  const { isConnected, isAuthenticated, isSigningIn, address, signIn, logout } = useSiweAuth();
  const {
    exchangeConnection,
    marketDataConfig,
    schedulerConfig,
    persistenceUpdatedAt,
    updateExchangeConnection,
    updateMarketDataConfig,
    updateSchedulerConfig,
  } = usePlatformStore();

  const [venue, setVenue] = useState(exchangeConnection.venue);
  const [label, setLabel] = useState(exchangeConnection.label);
  const [apiKey, setApiKey] = useState(exchangeConnection.apiKey);
  const [apiSecret, setApiSecret] = useState(exchangeConnection.apiSecret);
  const [passphrase, setPassphrase] = useState(exchangeConnection.passphrase);
  const [isTestnet, setIsTestnet] = useState(exchangeConnection.isTestnet);
  const [marketMode, setMarketMode] = useState(marketDataConfig.mode);
  const [provider, setProvider] = useState(marketDataConfig.provider);
  const [tickIntervalMs, setTickIntervalMs] = useState(marketDataConfig.tickIntervalMs);
  const [schedulerEnabled, setSchedulerEnabled] = useState(schedulerConfig.enabled);
  const [cadenceSec, setCadenceSec] = useState(schedulerConfig.cadenceSec);
  const [timezone, setTimezone] = useState(schedulerConfig.timezone);
  const [autoStartBots, setAutoStartBots] = useState(schedulerConfig.autoStartBots);
  const [persistCheckpoints, setPersistCheckpoints] = useState(schedulerConfig.persistCheckpoints);

  useEffect(() => {
    setVenue(exchangeConnection.venue);
    setLabel(exchangeConnection.label);
    setApiKey(exchangeConnection.apiKey);
    setApiSecret(exchangeConnection.apiSecret);
    setPassphrase(exchangeConnection.passphrase);
    setIsTestnet(exchangeConnection.isTestnet);
  }, [exchangeConnection]);

  useEffect(() => {
    setMarketMode(marketDataConfig.mode);
    setProvider(marketDataConfig.provider);
    setTickIntervalMs(marketDataConfig.tickIntervalMs);
  }, [marketDataConfig]);

  useEffect(() => {
    setSchedulerEnabled(schedulerConfig.enabled);
    setCadenceSec(schedulerConfig.cadenceSec);
    setTimezone(schedulerConfig.timezone);
    setAutoStartBots(schedulerConfig.autoStartBots);
    setPersistCheckpoints(schedulerConfig.persistCheckpoints);
  }, [schedulerConfig]);

  const schedulerStatus = useMemo(() => {
    if (!schedulerEnabled) return "已关闭";
    if (schedulerConfig.lastRunAt) return `运行中 · 最近执行 ${fmtTime(schedulerConfig.lastRunAt)}`;
    return "已启用 · 等待首次调度";
  }, [schedulerConfig.lastRunAt, schedulerEnabled]);

  const marketDataStatus = useMemo(() => {
    if (marketMode === "simulated") return "模拟行情";
    if (marketDataConfig.lastHeartbeatAt) return `真实行情在线 · 心跳 ${fmtTime(marketDataConfig.lastHeartbeatAt)}`;
    return "真实行情待接入";
  }, [marketDataConfig.lastHeartbeatAt, marketMode]);

  const handleSaveExchange = () => {
    updateExchangeConnection({
      venue,
      label,
      apiKey,
      apiSecret,
      passphrase,
      isTestnet,
    });
  };

  const handleSaveMarket = () => {
    updateMarketDataConfig({
      mode: marketMode,
      provider,
      tickIntervalMs: Math.min(10000, Math.max(250, tickIntervalMs)),
    });
  };

  const handleSaveScheduler = () => {
    updateSchedulerConfig({
      enabled: schedulerEnabled,
      cadenceSec: Math.min(3600, Math.max(5, cadenceSec)),
      timezone,
      autoStartBots,
      persistCheckpoints,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">设置</h2>
        <p className="text-[13px] text-muted mt-0.5">账户、真实交易接入、行情源与任务调度配置</p>
      </div>

      <section className="border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-medium text-foreground">钱包连接</h3>
            <p className="text-[11px] text-muted mt-0.5">生产环境建议结合 SIWE 与交易所 API 双重鉴权</p>
          </div>
          <span className="text-[11px] text-muted">Auth Layer</span>
        </div>

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

      <section className="border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-medium text-foreground">真实交易所接入</h3>
            <p className="text-[11px] text-muted mt-0.5">统一保存交易所凭证、测试网开关与接入状态</p>
          </div>
          <span className={`text-[11px] ${exchangeConnection.status === "configured" ? "text-profit" : "text-warning"}`}>
            {exchangeConnection.status === "configured" ? "已配置" : "待配置"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">Venue</span>
            <select value={venue} onChange={(e) => setVenue(e.target.value as typeof venue)} className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]">
              <option value="hyperliquid">Hyperliquid</option>
              <option value="binance">Binance</option>
              <option value="okx">OKX</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">Connection Label</span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Primary Perps"
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">API Key</span>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入你的 API Key"
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">API Secret</span>
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="输入你的 API Secret"
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">Passphrase</span>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="仅 OKX 等需要时填写"
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-md border border-border cursor-pointer hover:border-border-strong transition-colors">
            <div>
              <p className="text-[13px] text-foreground">使用测试网/沙盒</p>
              <p className="text-[11px] text-muted mt-0.5">首次接入真实交易所前建议先走 testnet 验证</p>
            </div>
            <input
              type="checkbox"
              checked={isTestnet}
              onChange={(e) => setIsTestnet(e.target.checked)}
              className="h-4 w-4 accent-[var(--profit)]"
            />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted">
            {exchangeConnection.lastValidatedAt
              ? `最近保存 ${fmtTime(exchangeConnection.lastValidatedAt)}`
              : "尚未保存交易所接入信息"}
          </p>
          <button
            onClick={handleSaveExchange}
            className="px-4 py-1.5 border border-border-strong text-[12px] text-foreground rounded-md hover:bg-white/[0.04] transition-colors"
          >
            保存交易所配置
          </button>
        </div>
      </section>

      <section className="border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-medium text-foreground">真实行情源</h3>
            <p className="text-[11px] text-muted mt-0.5">切换模拟/真实行情模式，并配置心跳与轮询参数</p>
          </div>
          <span className={`text-[11px] ${marketMode === "real" ? "text-profit" : "text-muted"}`}>{marketDataStatus}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">Mode</span>
            <select value={marketMode} onChange={(e) => setMarketMode(e.target.value as typeof marketMode)} className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]">
              <option value="simulated">Simulated</option>
              <option value="real">Real</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">Provider</span>
            <select value={provider} onChange={(e) => setProvider(e.target.value as typeof provider)} className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]">
              <option value="internal-sim">Internal Simulator</option>
              <option value="exchange-ws">Exchange WebSocket</option>
              <option value="aggregator">External Aggregator</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">Tick Interval</span>
            <input
              type="number"
              min={250}
              step={250}
              value={tickIntervalMs}
              onChange={(e) => setTickIntervalMs(Number(e.target.value))}
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]"
            />
          </label>
        </div>

        <div className="rounded-md border border-border p-3 text-[12px] text-muted">
          {marketMode === "real"
            ? "已切换到真实行情模式：前端将展示生产环境参数，并为后端 WebSocket / 聚合器接入保留配置。"
            : "当前使用模拟行情，以便在没有交易所凭证或回放环境时验证策略与风控。"}
        </div>

        <button
          onClick={handleSaveMarket}
          className="px-4 py-1.5 border border-border-strong text-[12px] text-foreground rounded-md hover:bg-white/[0.04] transition-colors"
        >
          保存行情配置
        </button>
      </section>

      <section className="border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-medium text-foreground">任务调度与持久化</h3>
            <p className="text-[11px] text-muted mt-0.5">配置调度频率、自动恢复与状态持久化策略</p>
          </div>
          <span className={`text-[11px] ${schedulerEnabled ? "text-profit" : "text-muted"}`}>{schedulerStatus}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex items-center justify-between p-3 rounded-md border border-border cursor-pointer hover:border-border-strong transition-colors">
            <div>
              <p className="text-[13px] text-foreground">启用后台调度</p>
              <p className="text-[11px] text-muted mt-0.5">为 Agent 运行、轮询与风控巡检保留统一 cadence</p>
            </div>
            <input
              type="checkbox"
              checked={schedulerEnabled}
              onChange={(e) => setSchedulerEnabled(e.target.checked)}
              className="h-4 w-4 accent-[var(--profit)]"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">Cadence (sec)</span>
            <input
              type="number"
              min={5}
              value={cadenceSec}
              onChange={(e) => setCadenceSec(Number(e.target.value))}
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">Timezone</span>
            <input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="UTC"
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center justify-between p-3 rounded-md border border-border cursor-pointer hover:border-border-strong transition-colors">
            <div>
              <p className="text-[13px] text-foreground">重启后自动恢复 Agent</p>
              <p className="text-[11px] text-muted mt-0.5">适合真实交易环境中的守护进程拉起</p>
            </div>
            <input
              type="checkbox"
              checked={autoStartBots}
              onChange={(e) => setAutoStartBots(e.target.checked)}
              className="h-4 w-4 accent-[var(--profit)]"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-md border border-border cursor-pointer hover:border-border-strong transition-colors">
            <div>
              <p className="text-[13px] text-foreground">保存 checkpoint / state</p>
              <p className="text-[11px] text-muted mt-0.5">当前使用浏览器本地持久化，为后续 DB/队列落盘预留入口</p>
            </div>
            <input
              type="checkbox"
              checked={persistCheckpoints}
              onChange={(e) => setPersistCheckpoints(e.target.checked)}
              className="h-4 w-4 accent-[var(--profit)]"
            />
          </label>
        </div>

        <div className="rounded-md border border-border p-3 text-[12px] text-muted space-y-1">
          <p>• 当前持久化介质：浏览器 localStorage（适合 demo / 单用户验证）。</p>
          <p>• 建议后续生产落地：Postgres 持久化 + 调度队列 + WebSocket 行情订阅。</p>
          <p>• 最近状态刷新：{persistenceUpdatedAt ? fmtTime(persistenceUpdatedAt) : "尚未写入持久化快照"}。</p>
        </div>

        <button
          onClick={handleSaveScheduler}
          className="px-4 py-1.5 border border-border-strong text-[12px] text-foreground rounded-md hover:bg-white/[0.04] transition-colors"
        >
          保存调度策略
        </button>
      </section>

      <section className="border border-border rounded-lg p-5 space-y-3">
        <h3 className="text-[13px] font-medium text-foreground">通知设置</h3>
        {["交易执行通知", "盈亏预警", "机器人状态变更", "风控触发告警"].map((item) => (
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
