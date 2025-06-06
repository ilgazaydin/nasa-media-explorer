/**
 * @file nasa.ts
 * @description Axios HTTP client instance configured for NASA's media API.
 *
 * - Sets a base URL and timeout for requests.
 * - Adds default headers to accept JSON.
 * - Includes a response interceptor for logging and forwarding errors.
 *
 * @example
 * import { nasaApi } from "@/lib/api/nasa";
 * const res = await nasaApi.get("/search", { params: { q: "moon" } });
 */

import axios, { AxiosError, AxiosResponse } from "axios";

export const nasaApi = axios.create({
  baseURL: "https://images-api.nasa.gov",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

nasaApi.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    console.error("API error:", error);
    return Promise.reject(error);
  }
);
