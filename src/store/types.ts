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
