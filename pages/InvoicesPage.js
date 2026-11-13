const { expect } = require("@playwright/test");

class InvoicesPage {
  constructor(page) {
    this.page = page;
  }

  // Assertions
  async expectInvoiceListed(invoiceNumber) {
    const invoiceRow = this.page
      .getByRole("row")
      .filter({ hasText: invoiceNumber });

    await expect(invoiceRow).toHaveCount(1);
    await expect(invoiceRow).toBeVisible();
  }
}

module.exports = { InvoicesPage };
