const { expect } = require("@playwright/test");

class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.emailInput = page.getByTestId("email");
    this.passwordInput = page.getByTestId("password");
    this.loginButton = page.getByTestId("login-submit");
  }

  // Actions
  async goto() {
    await this.page.goto("/auth/login");
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Assertions
  async expectLoginFormVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}

module.exports = { LoginPage };
