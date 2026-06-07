import { defineConfig } from "@playwright/test";

// Helper config for recording project preview videos via
// .codex-project-preview-capture.spec.ts. Run with:
//   PROJECT_SLUG=<slug> npx playwright test --config=playwright.capture.config.ts
export default defineConfig({
  testDir: ".",
  testMatch: ".codex-project-preview-capture.spec.ts",
  timeout: 180_000,
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    headless: true,
  },
});
