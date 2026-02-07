"use client";

import { useCallback } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useAuthStore } from "@/store/use-auth-store";
import { createSiweMessage, generateNonce, verifySignature } from "@/lib/siwe";

export function useSiweAuth() {
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { isAuthenticated, isSigningIn, token, setAuth, setSigningIn, logout } = useAuthStore();

  const signIn = useCallback(async () => {
    if (!address || !chainId) return;

    try {
      setSigningIn(true);

      // 1. 获取 nonce（正式环境从后端 GET /api/auth/nonce）
      const nonce = generateNonce();

      // 2. 构造 SIWE 消息
      const message = createSiweMessage(address, chainId, nonce);

      // 3. 请求用户签名
      const signature = await signMessageAsync({ message });

      // 4. 发送到后端验证，获取 JWT
      const { token } = await verifySignature(message, signature);

      // 5. 存储 token
      setAuth(token);

      // 同步到 platform store 的余额（模拟）
      const { usePlatformStore } = await import("@/store/use-platform-store");
      usePlatformStore.getState().connectWallet();
    } catch (err) {
      console.error("SIWE sign-in failed:", err);
      setSigningIn(false);
    }
  }, [address, chainId, signMessageAsync, setAuth, setSigningIn]);

  return {
    isConnected,
    isAuthenticated,
    isSigningIn,
    address,
    token,
    signIn,
    logout,
  };
}
