import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  use: {
    baseURL: 'http://127.0.0.1:3100',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
      args: ['--no-proxy-server'],
    },
  },
  // Always use a fresh production server, independent of a developer's running app.
  webServer: {
    command: 'npm start -- --port 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: false,
  },
});
