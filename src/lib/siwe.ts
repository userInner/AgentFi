import { SiweMessage } from "siwe";

export function createSiweMessage(address: string, chainId: number, nonce: string) {
  const message = new SiweMessage({
    domain: typeof window !== "undefined" ? window.location.host : "localhost:3000",
    address,
    statement: "Sign in to AgentFi Trading Platform",
    uri: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
    version: "1",
    chainId,
    nonce,
  });
  return message.prepareMessage();
}

export async function fetchNonce(): Promise<string> {
  const res = await fetch("/api/auth/nonce", { method: "GET" });
  if (!res.ok) {
    throw new Error("failed_to_fetch_nonce");
  }
  const data = (await res.json()) as { nonce: string };
  return data.nonce;
}

export async function verifySignature(message: string, signature: string): Promise<{
  token: string;
  address: string;
}> {
  const res = await fetch("/api/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, signature }),
  });

  if (!res.ok) {
    throw new Error("siwe_verify_failed");
  }

  return (await res.json()) as { token: string; address: string };
}
