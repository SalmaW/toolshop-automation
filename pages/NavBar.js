const { expect } = require("@playwright/test");

class NavBar {
  constructor(page) {
    this.page = page;

    // Locators
    this.navMenu = page.getByTestId("nav-menu");
    this.cartLink = page.getByTestId("nav-cart");
    this.cartQuantity = page.getByTestId("cart-quantity");
    this.myInvoicesLink = page.getByTestId("nav-my-invoices");
  }

  // Actions
  async openCart() {
    await this.cartLink.click();
  }

  async openMyInvoices() {
    await this.navMenu.click();
    await expect(this.myInvoicesLink).toBeVisible();
    await this.myInvoicesLink.click();
  }

  // Assertions
  async expectUserNameVisible(name) {
    await expect(this.navMenu).toContainText(name);
  }

  async expectCartCount(count) {
    // Exact match, so "1" does not also match "10"
    await expect(this.cartQuantity).toHaveText(String(count));
  }
}

module.exports = { NavBar };
