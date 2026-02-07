"use client";

import { StatCard } from "@/components/stat-card";
import { usePlatformStore } from "@/store/use-platform-store";
import { fmtUsd, fmtPnl, fmtPct } from "@/lib/format";

export default function PortfolioPage() {
  const { investments, redeemInvestment } = usePlatformStore();

  const totalInvested = investments.reduce((s, i) => s + i.invested, 0);
  const totalCurrent = investments.reduce((s, i) => s + i.current, 0);
  const totalPnl = totalCurrent - totalInvested;
  const totalRoi = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">我的投资</h2>
        <p className="text-[13px] text-muted mt-0.5">跟踪你的投资组合表现</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard label="总投入" value={fmtUsd(totalInvested)} />
        <StatCard label="当前价值" value={fmtUsd(totalCurrent)} change={fmtPct(totalRoi)} positive={totalRoi >= 0} />
        <StatCard label="总盈亏" value={fmtPnl(totalPnl)} positive={totalPnl >= 0} />
      </div>

      {investments.length === 0 ? (
        <div className="border border-border rounded-lg p-12 text-center">
          <p className="text-muted text-[13px]">暂无投资记录</p>
          <p className="text-muted-light text-[12px] mt-1">前往投资大厅选择交易员</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <h3 className="text-[13px] font-medium text-foreground">投资明细</h3>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border text-muted text-left">
                <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">机器人</th>
                <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">交易员</th>
                <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">投入金额</th>
                <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">当前价值</th>
                <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">盈亏</th>
                <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">ROI</th>
                <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv) => {
                const pnl = inv.current - inv.invested;
                return (
                  <tr key={inv.id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{inv.botName}</td>
                    <td className="px-5 py-3 text-muted">{inv.traderName}</td>
                    <td className="px-5 py-3 font-mono">{fmtUsd(inv.invested)}</td>
                    <td className="px-5 py-3 font-mono">{fmtUsd(inv.current)}</td>
                    <td className={`px-5 py-3 font-mono ${pnl >= 0 ? "text-profit" : "text-loss"}`}>{fmtPnl(pnl)}</td>
                    <td className={`px-5 py-3 font-mono ${inv.roi >= 0 ? "text-profit" : "text-loss"}`}>{fmtPct(inv.roi)}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => redeemInvestment(inv.id)}
                        className="px-3 py-1 text-[12px] text-muted border border-border rounded-md hover:text-loss hover:border-loss/30 transition-colors"
                      >
                        赎回
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
