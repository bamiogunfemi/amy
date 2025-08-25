import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    assetsDir: "assets",
    rollupOptions: {
      output: {
        // keep favicon root-only; let Vite hash everything else
        assetFileNames: (assetInfo) =>
          assetInfo.name === "favicon.ico"
            ? "favicon.ico"
            : "assets/[name]-[hash][extname]",
      },
    },
  },
});
