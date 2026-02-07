"use client";

import { StatCard } from "@/components/stat-card";
import { LiveDot } from "@/components/live-dot";
import { usePlatformStore } from "@/store/use-platform-store";
import { fmtUsd, fmtPct, fmtTime } from "@/lib/format";

export default function Dashboard() {
  const { bots, investments, transactions, traders } = usePlatformStore();

  const totalAum = bots.reduce((s, b) => s + b.aum, 0);
  const activeBots = bots.filter((b) => b.status === "running").length;
  const totalInvestors = traders.reduce((s, t) => s + t.investors, 0);
  const totalPnl = bots.reduce((s, b) => s + b.pnl, 0);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">仪表盘</h2>
          <p className="text-[13px] text-muted mt-0.5">平台运营概览</p>
        </div>
        <LiveDot />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="总管理资金" value={fmtUsd(totalAum)} change="12.5%" positive sparkData={bots[0]?.sparkData} />
        <StatCard label="活跃机器人" value={`${activeBots} / ${bots.length}`} change={`${activeBots} 运行中`} positive />
        <StatCard label="总投资者" value={`${totalInvestors}`} change={`${investments.length} 笔投资`} positive />
        <StatCard label="平台总盈亏" value={fmtUsd(totalPnl)} change={fmtPct(totalPnl / totalAum * 100)} positive={totalPnl >= 0} sparkData={bots[0]?.sparkData} />
      </div>

      {/* Bot table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <h3 className="text-[13px] font-medium text-foreground">交易机器人</h3>
          <span className="text-[11px] text-muted">实时数据</span>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border text-muted text-left">
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">名称</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">交易对</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">ROI</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">管理资金</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">交易次数</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">状态</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((bot) => (
              <tr key={bot.id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">{bot.name}</td>
                <td className="px-5 py-3 font-mono text-muted">{bot.pair}</td>
                <td className={`px-5 py-3 font-mono font-medium ${bot.roi >= 0 ? "text-profit" : "text-loss"}`}>
                  {fmtPct(bot.roi)}
                </td>
                <td className="px-5 py-3 font-mono">{fmtUsd(bot.aum)}</td>
                <td className="px-5 py-3 font-mono">{bot.trades.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={`text-[12px] ${bot.status === "running" ? "text-profit" : "text-muted"}`}>
                    {bot.status === "running" ? "运行中" : "已暂停"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent transactions */}
      {transactions.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <h3 className="text-[13px] font-medium text-foreground">最近交易</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border text-muted text-left sticky top-0 bg-background">
                  <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">时间</th>
                  <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">机器人</th>
                  <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">方向</th>
                  <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">交易对</th>
                  <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">金额</th>
                  <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">价格</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 15).map((tx) => (
                  <tr key={tx.id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-2.5 font-mono text-muted text-[12px]">{fmtTime(tx.timestamp)}</td>
                    <td className="px-5 py-2.5 text-foreground">{tx.botName}</td>
                    <td className={`px-5 py-2.5 font-mono ${tx.type === "buy" ? "text-profit" : "text-loss"}`}>
                      {tx.type === "buy" ? "买入" : "卖出"}
                    </td>
                    <td className="px-5 py-2.5 font-mono text-muted">{tx.pair}</td>
                    <td className="px-5 py-2.5 font-mono">{fmtUsd(tx.amount)}</td>
                    <td className="px-5 py-2.5 font-mono">{fmtUsd(tx.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
