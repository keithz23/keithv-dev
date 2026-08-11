import { apiClient } from "./api-client";

export type ApiError = {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  path: string;
  fieldErrors: Record<string, string>;
};

export type LoginInput = { email: string; password: string };
export type LoginResponse = {
  expiresAt: string;
};

export type AuthSessionResponse = {
  id: string;
  email: string;
  role: string;
};

export async function login(input: LoginInput) {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", input);
  return data;
}

export async function getSession() {
  const { data } = await apiClient.get<AuthSessionResponse>("/auth/session", {
    skipAuthRedirect: true,
  });
  return data;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}
