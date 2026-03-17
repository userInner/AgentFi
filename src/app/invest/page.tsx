"use client";

import { useMemo, useState } from "react";
import { usePlatformStore } from "@/store/use-platform-store";
import { fmtPct } from "@/lib/format";

export default function InvestPage() {
  const { bots, toggleBot } = usePlatformStore();
  const [maxPosition, setMaxPosition] = useState(20);
  const [stopLoss, setStopLoss] = useState(3.5);
  const [maxOrderPerHour, setMaxOrderPerHour] = useState(8);

  const runningBots = useMemo(() => bots.filter((b) => b.status === "running").length, [bots]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">执行中心</h2>
        <p className="text-[13px] text-muted mt-0.5">面向高阶用户的半自动执行与风控配置</p>
      </div>

      <section className="border border-border rounded-lg p-5 space-y-4">
        <h3 className="text-[13px] font-medium text-foreground">全局风控开关</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">最大仓位占比</span>
            <input
              type="number"
              value={maxPosition}
              onChange={(e) => setMaxPosition(Number(e.target.value))}
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]"
            />
            <p className="text-[11px] text-muted">当前值 {fmtPct(maxPosition)}</p>
          </label>
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">硬止损阈值</span>
            <input
              type="number"
              step="0.1"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]"
            />
            <p className="text-[11px] text-muted">单笔触发阈值 -{fmtPct(stopLoss)}</p>
          </label>
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">每小时最大执行次数</span>
            <input
              type="number"
              value={maxOrderPerHour}
              onChange={(e) => setMaxOrderPerHour(Number(e.target.value))}
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]"
            />
            <p className="text-[11px] text-muted">超过则自动降级为仅建议模式</p>
          </label>
        </div>
      </section>

      <section className="border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <h3 className="text-[13px] font-medium text-foreground">Agent 运行控制</h3>
          <span className="text-[11px] text-muted">运行中 {runningBots} / {bots.length}</span>
        </div>
        <div className="divide-y divide-border">
          {bots.map((bot) => (
            <div key={bot.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] text-foreground font-medium">{bot.name}</p>
                <p className="text-[12px] text-muted">{bot.strategy} · {bot.pair}</p>
              </div>
              <button
                onClick={() => toggleBot(bot.id)}
                className={`px-3 py-1.5 text-[12px] rounded-md border transition-colors ${
                  bot.status === "running"
                    ? "text-warning border-warning/30 hover:bg-warning/10"
                    : "text-profit border-profit/30 hover:bg-profit/10"
                }`}
              >
                {bot.status === "running" ? "暂停并人工复核" : "恢复半自动执行"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
