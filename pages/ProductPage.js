const { expect } = require("@playwright/test");

class ProductPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.productName = page.getByTestId("product-name");
    this.unitPrice = page.getByTestId("unit-price");
    this.addToCartButton = page.getByTestId("add-to-cart");
    this.toast = page.getByRole("alert");
  }

  // Actions
  async addToCart() {
    await this.addToCartButton.click();
  }

  // Assertions
  async expectProductDetails(productName, searchPrice) {
    await expect(this.productName).toHaveText(productName);

    // The search card shows "$11.14", the product page shows "11.14"
    const normalizedPrice = searchPrice.replace(/^\$\s*/, "").trim();
    await expect(this.unitPrice).toHaveText(normalizedPrice);
  }

  async expectProductAddedToCart(message) {
    await expect(this.toast.filter({ hasText: message })).toBeVisible();
  }
}

module.exports = { ProductPage };
