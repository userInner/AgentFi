"use client";

import { Sparkline } from "@/components/sparkline";
import { usePlatformStore } from "@/store/use-platform-store";
import { fmtUsd, fmtPnl, fmtPct } from "@/lib/format";

export default function BotsPage() {
  const { bots, toggleBot } = usePlatformStore();

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">交易机器人</h2>
          <p className="text-[13px] text-muted mt-0.5">管理你的 AI 交易策略</p>
        </div>
        <button className="px-4 py-2 border border-border-strong text-[13px] text-foreground rounded-md hover:bg-white/[0.04] transition-colors">
          + 创建机器人
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {bots.map((bot) => (
          <div key={bot.id} className="border border-border rounded-lg p-5 hover:border-border-strong transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{bot.name}</h3>
                  <span className="text-[11px] font-mono text-muted">{bot.pair}</span>
                </div>
                <p className="text-[12px] text-muted mt-0.5">{bot.strategy}</p>
              </div>
              <div className="flex items-center gap-3">
                <Sparkline
                  data={bot.sparkData}
                  color={bot.roi >= 0 ? "var(--profit)" : "var(--loss)"}
                  width={60}
                  height={24}
                />
                <span className={`text-[12px] ${bot.status === "running" ? "text-profit" : "text-muted"}`}>
                  {bot.status === "running" ? "运行中" : "已暂停"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">ROI</p>
                <p className={`font-mono text-sm font-medium mt-0.5 ${bot.roi >= 0 ? "text-profit" : "text-loss"}`}>
                  {fmtPct(bot.roi)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">盈亏</p>
                <p className={`font-mono text-sm font-medium mt-0.5 ${bot.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                  {fmtPnl(bot.pnl)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">管理资金</p>
                <p className="font-mono text-sm mt-0.5">{fmtUsd(bot.aum)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">胜率</p>
                <p className="font-mono text-sm mt-0.5">{bot.winRate}%</p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-border">
              <button className="flex-1 px-3 py-1.5 text-[12px] text-muted border border-border rounded-md hover:text-foreground hover:border-border-strong transition-colors">
                详情
              </button>
              <button
                onClick={() => toggleBot(bot.id)}
                className={`flex-1 px-3 py-1.5 text-[12px] rounded-md border transition-colors ${
                  bot.status === "running"
                    ? "text-muted border-border hover:text-warning hover:border-warning/30"
                    : "text-muted border-border hover:text-profit hover:border-profit/30"
                }`}
              >
                {bot.status === "running" ? "暂停" : "启动"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
