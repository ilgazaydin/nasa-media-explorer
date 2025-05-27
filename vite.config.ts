import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { configDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
