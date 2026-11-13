// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "https://practicesoftwaretesting.com",
    // The site exposes data-test attributes, so getByTestId() uses them
    testIdAttribute: "data-test",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  // One browser keeps the report at exactly 7 tests (TC-01 .. TC-07)
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
