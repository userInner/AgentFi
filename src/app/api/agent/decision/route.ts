import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/server/auth-session";

interface DecisionBody {
  pair: string;
  latestPrice: number;
  momentumPct: number;
  riskLevel: "low" | "medium" | "high";
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
  const session = token ? verifyToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as DecisionBody;
  if (!body?.pair || !Number.isFinite(body.latestPrice) || !Number.isFinite(body.momentumPct)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const cappedMomentum = Math.max(-5, Math.min(5, body.momentumPct));
  const riskBias = body.riskLevel === "high" ? 0.75 : body.riskLevel === "medium" ? 1 : 1.25;
  const score = cappedMomentum * riskBias;

  const action = score >= 0.8 ? "buy" : score <= -0.8 ? "sell" : "hold";
  const confidence = Math.min(0.95, Math.max(0.51, 0.58 + Math.abs(score) / 10));

  const reason =
    action === "hold"
      ? `动量 ${cappedMomentum.toFixed(2)}%，接近中性区间，建议观望。`
      : `动量 ${cappedMomentum.toFixed(2)}%，风险档位 ${body.riskLevel}，给出 ${action === "buy" ? "买入" : "卖出"} 建议。`;

  return NextResponse.json({
    pair: body.pair,
    action,
    confidence,
    reason,
    suggestedAmountUsd: action === "hold" ? 0 : Math.round(1200 + Math.abs(score) * 600),
    generatedAt: Date.now(),
    owner: session.sub,
  });
}
