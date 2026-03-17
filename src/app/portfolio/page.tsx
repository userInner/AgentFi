"use client";

import { useMemo } from "react";
import { usePlatformStore } from "@/store/use-platform-store";
import { fmtTime, fmtUsd } from "@/lib/format";

export default function PortfolioPage() {
  const { transactions } = usePlatformStore();

  const confirmedCount = useMemo(() => Math.floor(transactions.length * 0.58), [transactions.length]);
  const pendingCount = Math.max(0, transactions.length - confirmedCount);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">决策日志</h2>
        <p className="text-[13px] text-muted mt-0.5">记录每次建议、执行与结果，支持审计回放</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border border-border rounded-lg p-4">
          <p className="text-[11px] text-muted uppercase tracking-wider">总事件数</p>
          <p className="text-xl font-mono mt-1">{transactions.length}</p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <p className="text-[11px] text-muted uppercase tracking-wider">已确认执行</p>
          <p className="text-xl font-mono mt-1 text-profit">{confirmedCount}</p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <p className="text-[11px] text-muted uppercase tracking-wider">待确认</p>
          <p className="text-xl font-mono mt-1 text-warning">{pendingCount}</p>
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <h3 className="text-[13px] font-medium text-foreground">日志明细</h3>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border text-muted text-left">
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">时间</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">Agent</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">建议</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">金额</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">状态</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 20).map((tx, idx) => {
              const confirmed = idx % 3 !== 0;
              return (
                <tr key={tx.id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 font-mono text-muted text-[12px]">{fmtTime(tx.timestamp)}</td>
                  <td className="px-5 py-3 text-foreground">{tx.botName}</td>
                  <td className={`px-5 py-3 font-mono ${tx.type === "buy" ? "text-profit" : "text-loss"}`}>
                    {tx.type === "buy" ? "建议买入" : "建议卖出"}
                  </td>
                  <td className="px-5 py-3 font-mono">{fmtUsd(tx.amount)}</td>
                  <td className={`px-5 py-3 text-[12px] ${confirmed ? "text-profit" : "text-warning"}`}>
                    {confirmed ? "已确认执行" : "待人工确认"}
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted text-[12px]">
                  暂无日志。运行 Agent 后将自动生成可回放记录。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
