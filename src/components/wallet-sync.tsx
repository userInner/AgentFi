"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useAuthStore } from "@/store/use-auth-store";
import { usePlatformStore } from "@/store/use-platform-store";

/**
 * 同步 wagmi 钱包状态到 auth store 和 platform store
 */
export function WalletSync() {
  const { address, chainId, isConnected } = useAccount();
  const setWalletState = useAuthStore((s) => s.setWalletState);
  const authLogout = useAuthStore((s) => s.logout);
  const platformDisconnect = usePlatformStore((s) => s.disconnectWallet);

  useEffect(() => {
    setWalletState(isConnected, address ?? undefined, chainId);

    if (!isConnected) {
      platformDisconnect();
    }
  }, [isConnected, address, chainId, setWalletState, platformDisconnect]);

  return null;
}
