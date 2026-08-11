export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

let status: AuthStatus = "loading";
const listeners = new Set<() => void>();

export function getAuthStatus() {
  return status;
}

export function markAuthenticated() {
  status = "authenticated";
  listeners.forEach((listener) => listener());
}

export function markUnauthenticated() {
  status = "unauthenticated";
  listeners.forEach((listener) => listener());
}

export function subscribeToAuth(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
