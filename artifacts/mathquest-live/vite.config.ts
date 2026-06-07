import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const rawPort = process.env.FRONTEND_PORT ?? "18567";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";
const apiProxyTarget = process.env.API_PROXY_TARGET ?? "http://localhost:8080";
const host = process.env.HOST ?? "127.0.0.1";
const defaultAllowedHosts = ["localhost", "127.0.0.1", "::1", host];

function readAllowedHosts() {
  const raw = process.env.VITE_ALLOWED_HOSTS;
  if (!raw) return Array.from(new Set(defaultAllowedHosts));
  if (raw.trim() === "*") return true;
  return Array.from(
    new Set([
      ...defaultAllowedHosts,
      ...raw
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    ]),
  );
}

const allowedHosts = readAllowedHosts();

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host,
    allowedHosts,
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host,
    allowedHosts,
  },
});
