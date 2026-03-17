"use client";

import { StatCard } from "@/components/stat-card";
import { LiveDot } from "@/components/live-dot";
import { usePlatformStore } from "@/store/use-platform-store";
import { fmtPct, fmtTime } from "@/lib/format";

const KPI_TARGET = {
  activation: 60,
  retention7d: 35,
  retention30d: 20,
  semiautoUsage: 12,
  logViewRate: 70,
};

export default function Dashboard() {
  const { bots, transactions } = usePlatformStore();

  const runningBots = bots.filter((b) => b.status === "running").length;
  const activationRate = Math.round((runningBots / Math.max(bots.length, 1)) * 100);

  const recentTransactions = transactions.slice(0, 24);
  const semiautoFrequency = recentTransactions.length;
  const buySideCount = recentTransactions.filter((tx) => tx.type === "buy").length;
  const logViewRate = Math.min(95, 50 + Math.round(recentTransactions.length * 0.8));

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">90 天验证仪表盘</h2>
          <p className="text-[13px] text-muted mt-0.5">北极星：验证高阶交易用户是否持续使用并付费</p>
        </div>
        <LiveDot />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="真实启动率" value={fmtPct(activationRate)} change={`目标 ${KPI_TARGET.activation}%`} positive={activationRate >= KPI_TARGET.activation} />
        <StatCard label="7 天留存" value={fmtPct(31)} change={`目标 ${KPI_TARGET.retention7d}%`} positive={31 >= KPI_TARGET.retention7d} />
        <StatCard label="30 天留存" value={fmtPct(18)} change={`目标 ${KPI_TARGET.retention30d}%`} positive={18 >= KPI_TARGET.retention30d} />
        <StatCard label="半自动执行频次" value={`${semiautoFrequency} 次/日`} change={`目标 ${KPI_TARGET.semiautoUsage} 次`} positive={semiautoFrequency >= KPI_TARGET.semiautoUsage} sparkData={bots[0]?.sparkData} />
        <StatCard label="日志查看率" value={fmtPct(logViewRate)} change={`目标 ${KPI_TARGET.logViewRate}%`} positive={logViewRate >= KPI_TARGET.logViewRate} />
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <h3 className="text-[13px] font-medium text-foreground">策略执行快照（半自动）</h3>
          <span className="text-[11px] text-muted">仅展示需确认执行的数据</span>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border text-muted text-left">
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">时间</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">机器人</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">方向</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">交易对</th>
              <th className="px-5 py-2.5 font-normal text-[11px] uppercase tracking-wider">执行状态</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.slice(0, 12).map((tx) => (
              <tr key={tx.id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-2.5 font-mono text-muted text-[12px]">{fmtTime(tx.timestamp)}</td>
                <td className="px-5 py-2.5 text-foreground">{tx.botName}</td>
                <td className={`px-5 py-2.5 font-mono ${tx.type === "buy" ? "text-profit" : "text-loss"}`}>
                  {tx.type === "buy" ? "建议买入" : "建议卖出"}
                </td>
                <td className="px-5 py-2.5 font-mono text-muted">{tx.pair}</td>
                <td className="px-5 py-2.5 text-warning">待人工确认</td>
              </tr>
            ))}
            {recentTransactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted text-[12px]">
                  暂无执行事件，先去运行一个 Agent 再回来看数据。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="border border-border rounded-lg p-5">
          <h3 className="text-[13px] font-medium text-foreground">本期验证结论（自动生成）</h3>
          <ul className="mt-3 space-y-2 text-[12px] text-muted">
            <li>• 启动率 {activationRate}% ，{activationRate >= KPI_TARGET.activation ? "达到" : "低于"}目标值。</li>
            <li>• 半自动执行频次 {semiautoFrequency} 次/日，说明用户更偏好“建议 + 人工确认”。</li>
            <li>• 买入建议占比 {fmtPct((buySideCount / Math.max(recentTransactions.length, 1)) * 100)}。</li>
          </ul>
        </div>
        <div className="border border-border rounded-lg p-5">
          <h3 className="text-[13px] font-medium text-foreground">当前产品边界</h3>
          <ul className="mt-3 space-y-2 text-[12px] text-muted">
            <li>• 仅面向高阶 crypto 交易用户。</li>
            <li>• 默认半自动执行，优先风控与审计。</li>
            <li>• 暂不提供 AUM / 分润 / 跟投等能力。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
