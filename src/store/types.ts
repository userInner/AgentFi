export interface Bot {
  id: string;
  name: string;
  strategy: string;
  pair: string;
  status: "running" | "paused";
  roi: number;
  pnl: number;
  aum: number;
  winRate: number;
  trades: number;
  sparkData: number[];
}

export interface Trader {
  id: string;
  name: string;
  description: string;
  totalReturn: number;
  monthReturn: number;
  aum: number;
  investors: number;
  maxDrawdown: number;
  profitShare: number;
  bots: number;
}

export interface Investment {
  id: string;
  botId: string;
  botName: string;
  traderName: string;
  invested: number;
  current: number;
  roi: number;
  since: string;
}

export interface Transaction {
  id: string;
  botId: string;
  botName: string;
  type: "buy" | "sell";
  pair: string;
  amount: number;
  price: number;
  pnl: number;
  timestamp: number;
}

export interface RiskConfig {
  maxPositionPct: number;
  stopLossPct: number;
  maxOrdersPerHour: number;
  autoPauseOnBreach: boolean;
}

export interface RiskAlert {
  id: string;
  botId: string;
  botName: string;
  type: "position_limit" | "frequency_limit" | "stop_loss";
  message: string;
  timestamp: number;
}

export interface ExchangeConnection {
  venue: "hyperliquid" | "binance" | "okx";
  label: string;
  apiKey: string;
  apiSecret: string;
  passphrase: string;
  isTestnet: boolean;
  status: "disconnected" | "configured" | "connected";
  lastValidatedAt: number | null;
}

export interface MarketDataConfig {
  mode: "simulated" | "real";
  provider: "internal-sim" | "exchange-ws" | "aggregator";
  tickIntervalMs: number;
  symbols: string[];
  lastHeartbeatAt: number | null;
}

export interface SchedulerConfig {
  enabled: boolean;
  cadenceSec: number;
  timezone: string;
  autoStartBots: boolean;
  persistCheckpoints: boolean;
  lastRunAt: number | null;
}
