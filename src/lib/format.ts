export function fmtUsd(n: number): string {
  const abs = Math.abs(n);
  const str = abs >= 1000000
    ? `$${(abs / 1000000).toFixed(2)}M`
    : abs >= 1000
    ? `$${abs.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
    : `$${abs.toFixed(0)}`;
  return n < 0 ? `-${str}` : str;
}

export function fmtPnl(n: number): string {
  const s = fmtUsd(n);
  return n >= 0 ? `+${s}` : s;
}

export function fmtPct(n: number): string {
  const s = `${Math.abs(n).toFixed(1)}%`;
  return n >= 0 ? `+${s}` : `-${s}`;
}

export function fmtPrice(n: number): string {
  return n >= 1000
    ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
    : `$${n.toFixed(2)}`;
}

export function fmtTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
