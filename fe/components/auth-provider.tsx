"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  subscribeToAuth,
} from "@/lib/auth-store";

type AuthContextValue = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = useSyncExternalStore(subscribeToAuth, getAccessToken, () => null);
  return (
    <AuthContext.Provider
      value={{ token, login: setAccessToken, logout: clearAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
