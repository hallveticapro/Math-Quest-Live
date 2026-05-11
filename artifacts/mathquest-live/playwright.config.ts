import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: "http://127.0.0.1:18567",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "pnpm --filter @workspace/mathquest-live run dev -- --host 127.0.0.1",
    url: "http://127.0.0.1:18567",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
