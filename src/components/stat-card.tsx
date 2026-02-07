import { Sparkline } from "./sparkline";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  sparkData?: number[];
}

export function StatCard({ label, value, change, positive, sparkData }: StatCardProps) {
  return (
    <div className="relative border border-border rounded-lg p-4 hover:border-border-strong transition-colors overflow-hidden">
      {sparkData && (
        <div className="absolute bottom-2 right-3">
          <Sparkline
            data={sparkData}
            color={positive === false ? "var(--loss)" : "var(--profit)"}
          />
        </div>
      )}
      <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{label}</p>
      <p className="text-xl font-semibold font-mono text-foreground">{value}</p>
      {change && (
        <p className={`text-[12px] font-mono mt-1.5 ${positive ? "text-profit" : "text-loss"}`}>
          {positive ? "+" : ""}{change}
        </p>
      )}
    </div>
  );
}
