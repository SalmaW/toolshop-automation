const { expect } = require("@playwright/test");

class AccountPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.accountHeading = page.getByRole("heading", {
      name: "My account",
    });
  }

  // Assertions
  async expectAccountPage() {
    await expect(this.page).toHaveURL(/\/account\/?$/);
    await expect(this.accountHeading).toBeVisible();
  }
}

module.exports = { AccountPage };
