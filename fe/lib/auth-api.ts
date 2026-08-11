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
  accessToken: string;
  tokenType: "Bearer";
  expiresAt: string;
};

export async function login(input: LoginInput) {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", input);
  return data;
}
