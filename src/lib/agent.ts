export interface AgentDecisionRequest {
  pair: string;
  latestPrice: number;
  momentumPct: number;
  riskLevel: "low" | "medium" | "high";
}

export interface AgentDecisionResponse {
  pair: string;
  action: "buy" | "sell" | "hold";
  confidence: number;
  reason: string;
  suggestedAmountUsd: number;
  generatedAt: number;
}

export async function requestAgentDecision(token: string, payload: AgentDecisionRequest) {
  const res = await fetch("/api/agent/decision", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("agent_decision_failed");
  }

  return (await res.json()) as AgentDecisionResponse;
}
