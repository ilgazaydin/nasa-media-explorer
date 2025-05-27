/**
 * @file http.ts
 * @description Axios HTTP client instance configured for NASA's media API.
 *
 * - Sets a base URL and timeout for requests.
 * - Adds default headers to accept JSON.
 * - Includes a response interceptor for logging and forwarding errors.
 *
 * @example
 * import { http } from "@/lib/http";
 * const res = await http.get("/search", { params: { q: "moon" } });
 */

import axios, { AxiosError, AxiosResponse } from "axios";

export const http = axios.create({
  baseURL: "https://images-api.nasa.gov",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

http.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    console.error("API error:", error);
    return Promise.reject(error);
  }
);
