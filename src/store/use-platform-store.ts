import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  Bot,
  ExchangeConnection,
  Investment,
  MarketDataConfig,
  RiskAlert,
  RiskConfig,
  SchedulerConfig,
  Trader,
  Transaction,
} from "./types";

interface PlatformState {
  walletConnected: boolean;
  walletAddress: string;
  userBalance: number;
  bots: Bot[];
  traders: Trader[];
  investments: Investment[];
  transactions: Transaction[];
  riskConfig: RiskConfig;
  riskAlerts: RiskAlert[];
  exchangeConnection: ExchangeConnection;
  marketDataConfig: MarketDataConfig;
  schedulerConfig: SchedulerConfig;
  persistenceUpdatedAt: number | null;

  connectWallet: () => void;
  disconnectWallet: () => void;
  toggleBot: (botId: string) => void;
  tickBotData: () => void;
  updateRiskConfig: (next: Partial<RiskConfig>) => void;
  clearRiskAlerts: () => void;
  addInvestment: (traderId: string, amount: number) => void;
  redeemInvestment: (investmentId: string) => void;
  addTransaction: (tx: Transaction) => void;
  updateExchangeConnection: (next: Partial<ExchangeConnection>) => void;
  updateMarketDataConfig: (next: Partial<MarketDataConfig>) => void;
  updateSchedulerConfig: (next: Partial<SchedulerConfig>) => void;
}

const MAX_TRANSACTIONS = 50;
const MAX_ALERTS = 30;
const ONE_HOUR_MS = 60 * 60 * 1000;

const DEFAULT_RISK_CONFIG: RiskConfig = {
  maxPositionPct: 20,
  stopLossPct: 3.5,
  maxOrdersPerHour: 8,
  autoPauseOnBreach: true,
};

const DEFAULT_EXCHANGE_CONNECTION: ExchangeConnection = {
  venue: "hyperliquid",
  label: "Primary Perps",
  apiKey: "",
  apiSecret: "",
  passphrase: "",
  isTestnet: true,
  status: "disconnected",
  lastValidatedAt: null,
};

const DEFAULT_MARKET_DATA_CONFIG: MarketDataConfig = {
  mode: "simulated",
  provider: "internal-sim",
  tickIntervalMs: 2000,
  symbols: ["BTC-PERP", "ETH-PERP", "SOL-PERP"],
  lastHeartbeatAt: null,
};

const DEFAULT_SCHEDULER_CONFIG: SchedulerConfig = {
  enabled: false,
  cadenceSec: 30,
  timezone: "UTC",
  autoStartBots: false,
  persistCheckpoints: true,
  lastRunAt: null,
};

const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 100000)}`;
};

const createRiskAlert = (
  bot: Bot,
  type: RiskAlert["type"],
  message: string,
  timestamp: number,
): RiskAlert => ({
  id: createId("risk"),
  botId: bot.id,
  botName: bot.name,
  type,
  message,
  timestamp,
});

const INITIAL_BOTS: Bot[] = [
  {
    id: "bot-1", name: "Alpha Scalper", strategy: "高频剥头皮", pair: "BTC-PERP",
    status: "running", roi: 34.2, pnl: 12340, aum: 245000, winRate: 67, trades: 1243,
    sparkData: [10, 14, 12, 18, 16, 22, 20, 28, 25, 34],
  },
  {
    id: "bot-2", name: "Trend Rider", strategy: "趋势跟踪", pair: "ETH-PERP",
    status: "running", roi: 28.7, pnl: 8920, aum: 189000, winRate: 58, trades: 876,
    sparkData: [5, 8, 7, 12, 15, 14, 19, 22, 25, 28],
  },
  {
    id: "bot-3", name: "Grid Master", strategy: "网格交易", pair: "SOL-PERP",
    status: "running", roi: 19.5, pnl: 6780, aum: 156000, winRate: 72, trades: 2341,
    sparkData: [8, 9, 10, 11, 12, 13, 14, 16, 18, 19],
  },
  {
    id: "bot-4", name: "Momentum Bot", strategy: "动量突破", pair: "BTC-PERP",
    status: "paused", roi: -3.2, pnl: -1230, aum: 98000, winRate: 45, trades: 432,
    sparkData: [15, 14, 12, 10, 11, 8, 9, 7, 6, 5],
  },
];

const INITIAL_TRADERS: Trader[] = [
  {
    id: "trader-1", name: "CryptoWhale",
    description: "专注 BTC/ETH 趋势交易，3年链上交易经验",
    totalReturn: 156.3, monthReturn: 12.8, aum: 1200000,
    investors: 45, maxDrawdown: -8.2, profitShare: 20, bots: 3,
  },
  {
    id: "trader-2", name: "AlphaHunter",
    description: "多策略组合，覆盖主流币和山寨币",
    totalReturn: 98.7, monthReturn: 8.5, aum: 680000,
    investors: 32, maxDrawdown: -12.5, profitShare: 15, bots: 5,
  },
  {
    id: "trader-3", name: "GridKing",
    description: "低风险网格策略，稳定收益",
    totalReturn: 67.2, monthReturn: 5.3, aum: 450000,
    investors: 28, maxDrawdown: -4.1, profitShare: 10, bots: 2,
  },
];

const INITIAL_INVESTMENTS: Investment[] = [
  {
    id: "inv-1", botId: "bot-1", botName: "Alpha Scalper", traderName: "CryptoWhale",
    invested: 10000, current: 11250, roi: 12.5, since: "2025-12-01",
  },
  {
    id: "inv-2", botId: "bot-3", botName: "Grid Master", traderName: "GridKing",
    invested: 5000, current: 5430, roi: 8.6, since: "2026-01-15",
  },
];

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set) => ({
      walletConnected: false,
      walletAddress: "",
      userBalance: 50000,
      bots: INITIAL_BOTS,
      traders: INITIAL_TRADERS,
      investments: INITIAL_INVESTMENTS,
      transactions: [],
      riskConfig: DEFAULT_RISK_CONFIG,
      riskAlerts: [],
      exchangeConnection: DEFAULT_EXCHANGE_CONNECTION,
      marketDataConfig: DEFAULT_MARKET_DATA_CONFIG,
      schedulerConfig: DEFAULT_SCHEDULER_CONFIG,
      persistenceUpdatedAt: null,

      connectWallet: () =>
        set({
          walletConnected: true,
          walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          persistenceUpdatedAt: Date.now(),
        }),

      disconnectWallet: () =>
        set({ walletConnected: false, walletAddress: "", persistenceUpdatedAt: Date.now() }),

      toggleBot: (botId) =>
        set((state) => ({
          bots: state.bots.map((b) =>
            b.id === botId
              ? { ...b, status: b.status === "running" ? "paused" as const : "running" as const }
              : b,
          ),
          schedulerConfig: {
            ...state.schedulerConfig,
            lastRunAt: state.schedulerConfig.enabled ? Date.now() : state.schedulerConfig.lastRunAt,
          },
          persistenceUpdatedAt: Date.now(),
        })),

      updateRiskConfig: (next) =>
        set((state) => ({
          riskConfig: {
            ...state.riskConfig,
            ...next,
          },
          persistenceUpdatedAt: Date.now(),
        })),

      clearRiskAlerts: () => set({ riskAlerts: [], persistenceUpdatedAt: Date.now() }),

      tickBotData: () =>
        set((state) => {
          if (!state.bots.some((bot) => bot.status === "running")) {
            return state;
          }

          const now = Date.now();
          const lastHourStart = now - ONE_HOUR_MS;
          const recentOrders = state.transactions.filter((tx) => tx.timestamp >= lastHourStart).length;
          let blockedByFrequency = recentOrders >= state.riskConfig.maxOrdersPerHour;

          const newTxs: Transaction[] = [];
          const newAlerts: RiskAlert[] = [];

          const bots = state.bots.map((b) => {
            if (b.status !== "running") return b;

            const delta = (Math.random() - 0.35) * 0.8;
            const newRoi = Math.round((b.roi + delta) * 10) / 10;
            const pnlDelta = Math.round(b.aum * (delta / 100));
            const newPnl = b.pnl + pnlDelta;
            const newTrades = b.trades + (Math.random() > 0.5 ? 1 : 0);
            const newSpark = [...b.sparkData.slice(1), newRoi];

            let nextStatus: Bot["status"] = b.status;

            if (delta <= -(state.riskConfig.stopLossPct / 10)) {
              newAlerts.push(
                createRiskAlert(b, "stop_loss", `触发硬止损阈值：单次波动 ${delta.toFixed(2)}%`, now),
              );
              if (state.riskConfig.autoPauseOnBreach) {
                nextStatus = "paused";
              }
            }

            if (Math.random() > 0.6 && nextStatus === "running") {
              const amount = Math.round(Math.random() * 5000 + 500);
              const positionPct = (amount / b.aum) * 100;

              if (blockedByFrequency) {
                newAlerts.push(
                  createRiskAlert(b, "frequency_limit", `超过每小时 ${state.riskConfig.maxOrdersPerHour} 次执行上限，已降级为建议模式`, now),
                );
              } else if (positionPct > state.riskConfig.maxPositionPct) {
                newAlerts.push(
                  createRiskAlert(b, "position_limit", `建议仓位 ${positionPct.toFixed(1)}% 超过上限 ${state.riskConfig.maxPositionPct}%`, now),
                );
                if (state.riskConfig.autoPauseOnBreach) {
                  nextStatus = "paused";
                }
              } else {
                const isBuy = Math.random() > 0.5;
                newTxs.push({
                  id: createId("tx"),
                  botId: b.id,
                  botName: b.name,
                  type: isBuy ? "buy" : "sell",
                  pair: b.pair,
                  amount,
                  price: b.pair === "BTC-PERP" ? 95000 + Math.random() * 2000 : b.pair === "ETH-PERP" ? 3200 + Math.random() * 200 : 180 + Math.random() * 20,
                  pnl: isBuy ? 0 : Math.round((Math.random() - 0.3) * 500),
                  timestamp: now,
                });

                if (recentOrders + newTxs.length >= state.riskConfig.maxOrdersPerHour) {
                  blockedByFrequency = true;
                }
              }
            }

            return { ...b, status: nextStatus, roi: newRoi, pnl: newPnl, trades: newTrades, sparkData: newSpark };
          });

          const runningBotMap = new Map(bots.map((bot) => [bot.id, bot]));
          const investments = state.investments.map((inv) => {
            const bot = runningBotMap.get(inv.botId);
            if (!bot || bot.status !== "running") return inv;
            const fluctuation = (Math.random() - 0.35) * 0.002;
            const newCurrent = Math.round(inv.current * (1 + fluctuation));
            const newRoi = Math.round(((newCurrent - inv.invested) / inv.invested) * 1000) / 10;
            return { ...inv, current: newCurrent, roi: newRoi };
          });

          return {
            bots,
            investments,
            transactions: [...newTxs, ...state.transactions].slice(0, MAX_TRANSACTIONS),
            riskAlerts: [...newAlerts, ...state.riskAlerts].slice(0, MAX_ALERTS),
            marketDataConfig: {
              ...state.marketDataConfig,
              lastHeartbeatAt: now,
            },
            schedulerConfig: {
              ...state.schedulerConfig,
              lastRunAt: state.schedulerConfig.enabled ? now : state.schedulerConfig.lastRunAt,
            },
            persistenceUpdatedAt: now,
          };
        }),

      addInvestment: (traderId, amount) =>
        set((state) => {
          const trader = state.traders.find((t) => t.id === traderId);
          if (!trader || amount > state.userBalance) return state;

          const newInv: Investment = {
            id: createId("inv"),
            botId: state.bots[0]?.id || "bot-1",
            botName: `${trader.name} 策略`,
            traderName: trader.name,
            invested: amount,
            current: amount,
            roi: 0,
            since: new Date().toISOString().split("T")[0],
          };

          return {
            investments: [...state.investments, newInv],
            userBalance: state.userBalance - amount,
            traders: state.traders.map((t) =>
              t.id === traderId
                ? { ...t, aum: t.aum + amount, investors: t.investors + 1 }
                : t,
            ),
            persistenceUpdatedAt: Date.now(),
          };
        }),

      redeemInvestment: (investmentId) =>
        set((state) => {
          const inv = state.investments.find((i) => i.id === investmentId);
          if (!inv) return state;
          return {
            investments: state.investments.filter((i) => i.id !== investmentId),
            userBalance: state.userBalance + inv.current,
            persistenceUpdatedAt: Date.now(),
          };
        }),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions].slice(0, MAX_TRANSACTIONS),
          schedulerConfig: {
            ...state.schedulerConfig,
            lastRunAt: state.schedulerConfig.enabled ? Date.now() : state.schedulerConfig.lastRunAt,
          },
          persistenceUpdatedAt: Date.now(),
        })),

      updateExchangeConnection: (next) =>
        set((state) => {
          const apiKey = next.apiKey ?? state.exchangeConnection.apiKey;
          const apiSecret = next.apiSecret ?? state.exchangeConnection.apiSecret;
          const status = apiKey && apiSecret ? "configured" : "disconnected";

          return {
            exchangeConnection: {
              ...state.exchangeConnection,
              ...next,
              status,
              lastValidatedAt: status === "configured" ? Date.now() : null,
            },
            persistenceUpdatedAt: Date.now(),
          };
        }),

      updateMarketDataConfig: (next) =>
        set((state) => ({
          marketDataConfig: {
            ...state.marketDataConfig,
            ...next,
            lastHeartbeatAt: next.mode === "real" ? Date.now() : state.marketDataConfig.lastHeartbeatAt,
          },
          persistenceUpdatedAt: Date.now(),
        })),

      updateSchedulerConfig: (next) =>
        set((state) => ({
          schedulerConfig: {
            ...state.schedulerConfig,
            ...next,
            lastRunAt: next.enabled ? (state.schedulerConfig.lastRunAt ?? Date.now()) : state.schedulerConfig.lastRunAt,
          },
          persistenceUpdatedAt: Date.now(),
        })),
    }),
    {
      name: "agentfi-platform-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        walletConnected: state.walletConnected,
        walletAddress: state.walletAddress,
        userBalance: state.userBalance,
        bots: state.bots,
        traders: state.traders,
        investments: state.investments,
        transactions: state.transactions,
        riskConfig: state.riskConfig,
        riskAlerts: state.riskAlerts,
        exchangeConnection: state.exchangeConnection,
        marketDataConfig: state.marketDataConfig,
        schedulerConfig: state.schedulerConfig,
        persistenceUpdatedAt: state.persistenceUpdatedAt,
      }),
    },
  ),
);
