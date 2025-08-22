import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@amy/ui": resolve(__dirname, "./packages/ui/src"),
      "@amy/auth": resolve(__dirname, "./packages/auth/src"),
      "@amy/db": resolve(__dirname, "./packages/db/src"),
      "@amy/config": resolve(__dirname, "./packages/config/src"),
    },
  },
});
