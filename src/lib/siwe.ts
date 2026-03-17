import { SiweMessage } from "siwe";

/**
 * 构造 SIWE 消息
 */
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

/**
 * 生成随机 nonce（前端模拟，正式环境应从后端获取）
 */
export function generateNonce(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 模拟后端验证签名并返回 JWT
 * 正式环境替换为真实 API 调用：POST /api/auth/verify
 */
export async function verifySignature(message: string, signature: string): Promise<{
  token: string;
  address: string;
}> {
  // 模拟后端验证延迟
  await new Promise((r) => setTimeout(r, 500));

  // 从 message 中提取地址
  const addressMatch = message.match(/0x[a-fA-F0-9]{40}/);
  const address = addressMatch ? addressMatch[0] : "0x0000";

  // 模拟 JWT（正式环境由 Go 后端签发）
  const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.${btoa(
    JSON.stringify({ address, iat: Date.now(), exp: Date.now() + 86400000, sig: signature.slice(0, 10) })
  )}.mock_signature`;

  return { token, address };
}
