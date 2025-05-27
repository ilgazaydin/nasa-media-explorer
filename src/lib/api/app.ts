/**
 * @file app.ts
 * @description Axios HTTP client instance configured for the application API.
 *
 * - Sets a base URL from environment variable and timeout for requests.
 * - Adds default headers to accept JSON.
 * - Includes a response interceptor for logging and forwarding errors.
 *
 * @example
 * import { api } from "@/lib/api/app";
 * const res = await api.get("/me");
 */

import axios, { AxiosError, AxiosResponse } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    console.error("Auth API error:", error);
    return Promise.reject(error);
  }
);
