const TOKEN_KEY = "portfolio_admin_access_token";
const listeners = new Set<() => void>();

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!token || !isUnexpiredJwt(token)) {
    if (token) window.localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return token;
}

function isUnexpiredJwt(token: string) {
  try {
    const payload = JSON.parse(window.atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch { return false; }
}

export function setAccessToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
  listeners.forEach((listener) => listener());
}

export function clearAccessToken() {
  if (typeof window !== "undefined") window.localStorage.removeItem(TOKEN_KEY);
  listeners.forEach((listener) => listener());
}

export function subscribeToAuth(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
