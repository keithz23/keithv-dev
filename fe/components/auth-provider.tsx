"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import {
  getAuthStatus,
  markAuthenticated,
  markUnauthenticated,
  subscribeToAuth,
} from "@/lib/auth-store";
import { getSession, logout as logoutRequest } from "@/lib/auth-api";

type AuthContextValue = {
  status: ReturnType<typeof getAuthStatus>;
  login: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const status = useSyncExternalStore(subscribeToAuth, getAuthStatus, getAuthStatus);

  useEffect(() => {
    let active = true;
    getSession()
      .then(() => {
        if (active) markAuthenticated();
      })
      .catch(() => {
        if (active) markUnauthenticated();
      });

    return () => {
      active = false;
    };
  }, []);

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Clear the local auth state even when the API is unavailable.
    } finally {
      markUnauthenticated();
    }
  };

  return (
    <AuthContext.Provider
      value={{ status, login: markAuthenticated, logout }}
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
