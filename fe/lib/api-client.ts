import axios from "axios";
import { clearAccessToken, getAccessToken } from "./auth-store";

export const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8080/api/v1",
  withCredentials: true,
  timeout: 10_000,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAccessToken();
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/admin/login"
      ) {
        window.location.assign("/admin/login");
      }
    }
    return Promise.reject(error);
  },
);
