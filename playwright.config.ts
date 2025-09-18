import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,
    viewport: { width: 1366, height: 900 }
  }
});
