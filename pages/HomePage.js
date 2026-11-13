const { expect } = require("@playwright/test");

class HomePage {
  constructor(page) {
    this.page = page;

    // Search locators
    this.searchInput = page.getByTestId("search-query");
    this.searchButton = page.getByTestId("search-submit");
    this.searchCaption = page.getByTestId("search-caption");
    this.productNames = page.getByTestId("product-name");
  }

  // Actions
  async goto() {
    await this.page.goto("/");
  }

  async searchFor(productName) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  // Locate product card dynamically by product name
  async getProductCard(productName) {
    const matchingName = this.productNames.filter({
      hasText: productName,
    });

    const productCard = this.page
      .locator('[data-test^="product-"]')
      .filter({ has: matchingName })
      .filter({
        has: this.page.getByTestId("product-price"),
      });

    await expect(productCard).toHaveCount(1);

    return productCard;
  }

  async openProduct(productName) {
    const productCard = await this.getProductCard(productName);
    await productCard.click();
  }

  // Get price from search result card
  async getSearchResultPrice(productName) {
    const productCard = await this.getProductCard(productName);
    const price = productCard.getByTestId("product-price");

    await expect(price).toBeVisible();

    return (await price.innerText()).trim();
  }

  // Assertions
  async expectSearchResults(searchData) {
    await expect(this.searchCaption).toHaveText(searchData.expectedCaption);

    await expect(this.productNames).toHaveCount(searchData.expectedResultCount);

    await expect(this.productNames).toHaveText([
      searchData.expectedProductName,
    ]);
  }
}

module.exports = { HomePage };
