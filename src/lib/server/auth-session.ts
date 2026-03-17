import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const nonceStore = new Map<string, { expiresAt: number; used: boolean }>();

function getAuthSecret() {
  return process.env.AUTH_SECRET ?? "agentfi-dev-secret-change-me";
}

function base64UrlEncode(input: string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string) {
  const padded = input + "=".repeat((4 - (input.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

export function issueNonce(ttlMs = DEFAULT_TTL_MS) {
  const nonce = randomBytes(16).toString("hex");
  nonceStore.set(nonce, { expiresAt: Date.now() + ttlMs, used: false });
  return nonce;
}

export function consumeNonce(nonce: string) {
  const item = nonceStore.get(nonce);
  if (!item || item.used || item.expiresAt < Date.now()) {
    return false;
  }
  item.used = true;
  nonceStore.set(nonce, item);
  return true;
}

export function issueToken(address: string, ttlMs = 24 * 60 * 60 * 1000) {
  const payload = {
    sub: address.toLowerCase(),
    iat: Date.now(),
    exp: Date.now() + ttlMs,
  };

  const payloadStr = JSON.stringify(payload);
  const payloadEnc = base64UrlEncode(payloadStr);
  const signature = createHmac("sha256", getAuthSecret()).update(payloadEnc).digest("base64url");
  return `${payloadEnc}.${signature}`;
}

export function verifyToken(token: string) {
  const [payloadEnc, signature] = token.split(".");
  if (!payloadEnc || !signature) return null;

  const expected = createHmac("sha256", getAuthSecret()).update(payloadEnc).digest("base64url");
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length || !timingSafeEqual(signatureBuf, expectedBuf)) {
    return null;
  }

  const payload = JSON.parse(base64UrlDecode(payloadEnc)) as { sub: string; iat: number; exp: number };
  if (!payload?.sub || payload.exp < Date.now()) {
    return null;
  }

  return payload;
}
