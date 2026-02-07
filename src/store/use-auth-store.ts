import { create } from "zustand";

interface AuthState {
  // Wallet
  isConnected: boolean;
  address: string | null;
  chainId: number | null;

  // Auth (SIWE)
  token: string | null;
  isAuthenticated: boolean;
  isSigningIn: boolean;

  // Actions
  setWalletState: (connected: boolean, address?: string, chainId?: number) => void;
  setAuth: (token: string) => void;
  setSigningIn: (v: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isConnected: false,
  address: null,
  chainId: null,
  token: null,
  isAuthenticated: false,
  isSigningIn: false,

  setWalletState: (connected, address, chainId) =>
    set({
      isConnected: connected,
      address: address ?? null,
      chainId: chainId ?? null,
      // 断开钱包时清除认证
      ...(connected ? {} : { token: null, isAuthenticated: false }),
    }),

  setAuth: (token) =>
    set({ token, isAuthenticated: true, isSigningIn: false }),

  setSigningIn: (v) => set({ isSigningIn: v }),

  logout: () =>
    set({
      token: null,
      isAuthenticated: false,
      isConnected: false,
      address: null,
      chainId: null,
    }),
}));
