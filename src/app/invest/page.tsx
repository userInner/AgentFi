"use client";

import { useEffect, useMemo, useState } from "react";
import { usePlatformStore } from "@/store/use-platform-store";
import { fmtPct, fmtTime } from "@/lib/format";

export default function InvestPage() {
  const {
    bots,
    toggleBot,
    riskConfig,
    riskAlerts,
    updateRiskConfig,
    clearRiskAlerts,
  } = usePlatformStore();

  const [maxPosition, setMaxPosition] = useState(riskConfig.maxPositionPct);
  const [stopLoss, setStopLoss] = useState(riskConfig.stopLossPct);
  const [maxOrderPerHour, setMaxOrderPerHour] = useState(riskConfig.maxOrdersPerHour);
  const [autoPauseOnBreach, setAutoPauseOnBreach] = useState(riskConfig.autoPauseOnBreach);

  useEffect(() => {
    setMaxPosition(riskConfig.maxPositionPct);
    setStopLoss(riskConfig.stopLossPct);
    setMaxOrderPerHour(riskConfig.maxOrdersPerHour);
    setAutoPauseOnBreach(riskConfig.autoPauseOnBreach);
  }, [riskConfig]);

  const runningBots = useMemo(() => bots.filter((b) => b.status === "running").length, [bots]);
  const hasPendingChanges =
    maxPosition !== riskConfig.maxPositionPct ||
    stopLoss !== riskConfig.stopLossPct ||
    maxOrderPerHour !== riskConfig.maxOrdersPerHour ||
    autoPauseOnBreach !== riskConfig.autoPauseOnBreach;

  const handleSave = () => {
    updateRiskConfig({
      maxPositionPct: Math.min(100, Math.max(1, maxPosition)),
      stopLossPct: Math.min(20, Math.max(0.1, stopLoss)),
      maxOrdersPerHour: Math.min(60, Math.max(1, maxOrderPerHour)),
      autoPauseOnBreach,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">执行中心</h2>
        <p className="text-[13px] text-muted mt-0.5">面向高阶用户的半自动执行与风控配置</p>
      </div>

      <section className="border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-medium text-foreground">全局风控开关</h3>
          <button
            onClick={handleSave}
            disabled={!hasPendingChanges}
            className="px-4 py-1.5 border border-border-strong text-[12px] text-foreground rounded-md hover:bg-white/[0.04] disabled:opacity-40 transition-colors"
          >
            保存风控策略
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">最大仓位占比</span>
            <input
              type="number"
              value={maxPosition}
              onChange={(e) => setMaxPosition(Number(e.target.value))}
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]"
            />
            <p className="text-[11px] text-muted">建议单笔仓位必须 ≤ {fmtPct(maxPosition)}</p>
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
            <p className="text-[11px] text-muted">单次波动 ≤ -{fmtPct(stopLoss)} 将触发止损</p>
          </label>
          <label className="space-y-1.5">
            <span className="text-[11px] text-muted uppercase tracking-wider">每小时最大执行次数</span>
            <input
              type="number"
              value={maxOrderPerHour}
              onChange={(e) => setMaxOrderPerHour(Number(e.target.value))}
              className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-[13px]"
            />
            <p className="text-[11px] text-muted">超过上限后自动降级为仅建议模式</p>
          </label>
        </div>

        <label className="flex items-center justify-between p-3 rounded-md border border-border cursor-pointer hover:border-border-strong transition-colors">
          <div>
            <p className="text-[13px] text-foreground">风控触发后自动暂停 Agent</p>
            <p className="text-[11px] text-muted mt-0.5">建议在生产环境保持开启</p>
          </div>
          <input
            type="checkbox"
            checked={autoPauseOnBreach}
            onChange={(e) => setAutoPauseOnBreach(e.target.checked)}
            className="h-4 w-4 accent-[var(--profit)]"
          />
        </label>
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

      <section className="border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <h3 className="text-[13px] font-medium text-foreground">风控触发日志</h3>
          <button onClick={clearRiskAlerts} className="text-[11px] text-muted hover:text-foreground transition-colors">清空</button>
        </div>
        <div className="divide-y divide-border">
          {riskAlerts.slice(0, 8).map((alert) => (
            <div key={alert.id} className="px-5 py-3 text-[12px]">
              <p className="text-foreground">{alert.botName} · {alert.message}</p>
              <p className="text-muted mt-0.5">{fmtTime(alert.timestamp)}</p>
            </div>
          ))}
          {riskAlerts.length === 0 && (
            <p className="px-5 py-8 text-[12px] text-muted text-center">暂无风控触发记录，当前执行健康。</p>
          )}
        </div>
      </section>
    </div>
  );
}
