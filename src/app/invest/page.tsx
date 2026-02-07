"use client";

import { useState } from "react";
import { useAppKit } from "@reown/appkit/react";
import { usePlatformStore } from "@/store/use-platform-store";
import { useAuthStore } from "@/store/use-auth-store";
import { fmtUsd, fmtPct } from "@/lib/format";

export default function InvestPage() {
  const { traders, userBalance, addInvestment } = usePlatformStore();
  const { isAuthenticated } = useAuthStore();
  const { open } = useAppKit();
  const [investingId, setInvestingId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  const handleInvest = (traderId: string) => {
    const num = parseFloat(amount);
    if (!num || num <= 0 || num > userBalance) return;
    addInvestment(traderId, num);
    setInvestingId(null);
    setAmount("");
  };

  const handleClickInvest = (traderId: string) => {
    if (!isAuthenticated) {
      open();
      return;
    }
    setInvestingId(traderId);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">投资大厅</h2>
        <p className="text-[13px] text-muted mt-0.5">选择优秀的 AI 交易员，跟投赚取收益</p>
      </div>

      <div className="flex gap-2 text-[12px]">
        {["全部", "高收益", "低风险", "新上线"].map((tag, i) => (
          <button
            key={tag}
            className={`px-3 py-1.5 rounded-md border transition-colors ${
              i === 0
                ? "border-border-strong text-foreground bg-white/[0.04]"
                : "border-border text-muted hover:text-foreground hover:border-border-strong"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {traders.map((t) => (
          <div key={t.id} className="border border-border rounded-lg p-5 hover:border-border-strong transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{t.name}</h3>
                  <span className="text-[11px] text-muted font-mono">{t.bots} 个机器人</span>
                </div>
                <p className="text-[12px] text-muted mt-0.5">{t.description}</p>
              </div>
              {investingId === t.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`最多 ${fmtUsd(userBalance)}`}
                    className="w-36 px-3 py-1.5 bg-transparent border border-border-strong rounded-md text-[12px] font-mono text-foreground placeholder:text-muted-light focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleInvest(t.id)}
                    className="px-3 py-1.5 border border-profit/30 text-[12px] text-profit rounded-md hover:bg-profit/10 transition-colors"
                  >
                    确认
                  </button>
                  <button
                    onClick={() => { setInvestingId(null); setAmount(""); }}
                    className="px-3 py-1.5 border border-border text-[12px] text-muted rounded-md hover:text-foreground transition-colors"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleClickInvest(t.id)}
                  className="px-4 py-1.5 border border-border-strong text-[12px] text-foreground rounded-md hover:bg-white/[0.04] transition-colors"
                >
                  {isAuthenticated ? "投资" : "连接钱包"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">总收益率</p>
                <p className="font-mono text-sm font-medium text-profit mt-0.5">{fmtPct(t.totalReturn)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">月收益</p>
                <p className="font-mono text-sm font-medium text-profit mt-0.5">{fmtPct(t.monthReturn)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">管理资金</p>
                <p className="font-mono text-sm mt-0.5">{fmtUsd(t.aum)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">投资者</p>
                <p className="font-mono text-sm mt-0.5">{t.investors}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">最大回撤</p>
                <p className="font-mono text-sm text-loss mt-0.5">{fmtPct(t.maxDrawdown)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">利润分成</p>
                <p className="font-mono text-sm mt-0.5">{t.profitShare}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
