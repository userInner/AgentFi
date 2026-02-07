import { create } from "zustand";
import type { Bot, Trader, Investment, Transaction } from "./types";

interface PlatformState {
  // User
  walletConnected: boolean;
  walletAddress: string;
  userBalance: number;

  // Bots
  bots: Bot[];

  // Traders
  traders: Trader[];

  // Investments
  investments: Investment[];

  // Transactions (recent)
  transactions: Transaction[];

  // Actions
  connectWallet: () => void;
  disconnectWallet: () => void;
  toggleBot: (botId: string) => void;
  tickBotData: () => void;
  addInvestment: (traderId: string, amount: number) => void;
  redeemInvestment: (investmentId: string) => void;
  addTransaction: (tx: Transaction) => void;
}

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

export const usePlatformStore = create<PlatformState>((set, get) => ({
  walletConnected: false,
  walletAddress: "",
  userBalance: 50000,
  bots: INITIAL_BOTS,
  traders: INITIAL_TRADERS,
  investments: INITIAL_INVESTMENTS,
  transactions: [],

  connectWallet: () =>
    set({
      walletConnected: true,
      walletAddress: "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6),
    }),

  disconnectWallet: () =>
    set({ walletConnected: false, walletAddress: "" }),

  toggleBot: (botId) =>
    set((state) => ({
      bots: state.bots.map((b) =>
        b.id === botId
          ? { ...b, status: b.status === "running" ? "paused" as const : "running" as const }
          : b
      ),
    })),

  tickBotData: () =>
    set((state) => {
      const newTxs: Transaction[] = [];

      const bots = state.bots.map((b) => {
        if (b.status !== "running") return b;

        // Random ROI fluctuation: -0.3% ~ +0.5%
        const delta = (Math.random() - 0.35) * 0.8;
        const newRoi = Math.round((b.roi + delta) * 10) / 10;
        const pnlDelta = Math.round(b.aum * (delta / 100));
        const newPnl = b.pnl + pnlDelta;
        const newTrades = b.trades + (Math.random() > 0.5 ? 1 : 0);
        const newSpark = [...b.sparkData.slice(1), newRoi];

        // Occasionally generate a transaction
        if (Math.random() > 0.6) {
          const isBuy = Math.random() > 0.5;
          newTxs.push({
            id: `tx-${Date.now()}-${b.id}`,
            botId: b.id,
            botName: b.name,
            type: isBuy ? "buy" : "sell",
            pair: b.pair,
            amount: Math.round(Math.random() * 5000 + 500),
            price: b.pair === "BTC-PERP" ? 95000 + Math.random() * 2000 : b.pair === "ETH-PERP" ? 3200 + Math.random() * 200 : 180 + Math.random() * 20,
            pnl: isBuy ? 0 : Math.round((Math.random() - 0.3) * 500),
            timestamp: Date.now(),
          });
        }

        return { ...b, roi: newRoi, pnl: newPnl, trades: newTrades, sparkData: newSpark };
      });

      // Update investments based on bot performance
      const investments = state.investments.map((inv) => {
        const bot = bots.find((b) => b.id === inv.botId);
        if (!bot || bot.status !== "running") return inv;
        const fluctuation = (Math.random() - 0.35) * 0.002;
        const newCurrent = Math.round(inv.current * (1 + fluctuation));
        const newRoi = Math.round(((newCurrent - inv.invested) / inv.invested) * 1000) / 10;
        return { ...inv, current: newCurrent, roi: newRoi };
      });

      return {
        bots,
        investments,
        transactions: [...newTxs, ...state.transactions].slice(0, 50),
      };
    }),

  addInvestment: (traderId, amount) =>
    set((state) => {
      const trader = state.traders.find((t) => t.id === traderId);
      if (!trader || amount > state.userBalance) return state;

      const newInv: Investment = {
        id: `inv-${Date.now()}`,
        botId: state.bots[0]?.id || "bot-1",
        botName: trader.name + " 策略",
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
            : t
        ),
      };
    }),

  redeemInvestment: (investmentId) =>
    set((state) => {
      const inv = state.investments.find((i) => i.id === investmentId);
      if (!inv) return state;
      return {
        investments: state.investments.filter((i) => i.id !== investmentId),
        userBalance: state.userBalance + inv.current,
      };
    }),

  addTransaction: (tx) =>
    set((state) => ({
      transactions: [tx, ...state.transactions].slice(0, 50),
    })),
}));
