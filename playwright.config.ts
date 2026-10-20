import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir: './tests', fullyParallel: false,
 use: { baseURL: 'http://127.0.0.1:3000', launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-proxy-server'] } },
 webServer: { command: 'npm start -- --port 3000', url: 'http://127.0.0.1:3000', reuseExistingServer: !process.env.CI },
});
