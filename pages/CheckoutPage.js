const { expect } = require("@playwright/test");

function toCents(price) {
  const amount = Number(price.replace(/[^0-9.-]/g, ""));

  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid price value: ${price}`);
  }

  return Math.round(amount * 100);
}

class CheckoutPage {
  constructor(page) {
    this.page = page;

    // Cart locators
    this.cartBody = page.locator("tbody");
    this.cartRows = page.locator("tbody tr");
    this.productQuantity = page.getByTestId("product-quantity");
    this.productPrice = page.getByTestId("product-price");
    this.linePrice = page.getByTestId("line-price");
    this.cartTotal = page.getByTestId("cart-total");

    // Checkout locators
    this.proceed1 = page.getByTestId("proceed-1");
    this.proceed2 = page.getByTestId("proceed-2");
    this.proceed3 = page.getByTestId("proceed-3");

    this.country = page.getByTestId("country");
    this.postalCode = page.getByTestId("postal_code");
    this.houseNumber = page.getByTestId("house_number");

    this.street = page.getByTestId("street");
    this.city = page.getByTestId("city");
    this.state = page.getByTestId("state");

    this.paymentMethod = page.getByTestId("payment-method");
    this.finishButton = page.getByTestId("finish");

    this.paymentSuccessMessage = page.getByTestId("payment-success-message");

    // Step 2 (sign in) shows this message when the user is already logged in
    this.alreadyLoggedInMessage = page.getByText(/you are already logged in/i);

    this.orderConfirmation = page.getByText(/Thanks for your order! Your/);

    this.invoiceNumber = page.getByText(/INV-/);
  }

  // Cart assertions
  async expectCartItem(productName, quantity) {
    await expect(this.cartRows).toHaveCount(1);
    await expect(this.cartBody).toContainText(productName);

    await expect(this.productQuantity).toHaveValue(String(quantity));
  }

  async expectCartPrices(quantity) {
    const unitPriceText = await this.productPrice.innerText();
    const linePriceText = await this.linePrice.innerText();
    const totalText = await this.cartTotal.innerText();

    const unitPrice = toCents(unitPriceText);
    const linePrice = toCents(linePriceText);
    const total = toCents(totalText);

    // Line price = unit price × quantity
    expect(linePrice).toBe(unitPrice * quantity);

    // Cart total = line price
    expect(total).toBe(linePrice);
  }

  // Checkout actions
  async proceedFromCart() {
    await this.proceed1.click();
  }

  async proceedFromSignIn() {
    await this.proceed2.click();
  }

  async proceedFromBilling() {
    await this.proceed3.click();
  }

  async selectPaymentMethod(method) {
    await this.paymentMethod.selectOption(method);
    // Verify that the selection actually happened
    await expect(this.paymentMethod).toHaveValue(method);
  }

  async finishPayment() {
    await expect(this.finishButton).toBeEnabled();
    await this.finishButton.click();
  }

  // Checkout assertions
  async expectSignInStepSkipped(customerName) {
    await expect(this.alreadyLoggedInMessage).toBeVisible();
    await expect(this.alreadyLoggedInMessage).toContainText(customerName);
    await expect(this.proceed2).toBeVisible();
  }

  async expectBillingStepVisible() {
    await expect(this.country).toBeVisible();
    await expect(this.street).toBeVisible();
  }

  // Verify fields populated from the saved address
  async expectBillingAddressPrefilled(address) {
    await expect(this.country).toHaveValue(address.country);
    await expect(this.postalCode).toHaveValue(address.postalCode);
  }

  // Enter missing house number and verify address
  async completeBillingAddress(address) {
    await this.houseNumber.fill(address.houseNumber);

    await expect(this.houseNumber).toHaveValue(address.houseNumber);

    // These fields are populated automatically
    await expect(this.street).toHaveValue(address.street);
    await expect(this.city).toHaveValue(address.city);
    await expect(this.state).toHaveValue(address.state);
  }

  async expectPaymentStepVisible() {
    await expect(this.paymentMethod).toBeVisible();
    await expect(this.finishButton).toBeVisible();
  }

  async expectPaymentMethodSelected(method) {
    await expect(this.paymentMethod).toHaveValue(method);
  }

  async expectPaymentSuccessful() {
    await expect(this.paymentSuccessMessage).toContainText(
      "Payment was successful",
    );
  }

  async expectOrderConfirmation() {
    await expect(this.orderConfirmation).toBeVisible();
    await expect(this.invoiceNumber).toBeVisible();
  }

  async getInvoiceNumber() {
    const invoiceText = await this.invoiceNumber.innerText();
    const match = invoiceText.match(/INV-[A-Z0-9-]+/);

    if (!match) {
      throw new Error("Invoice number was not found");
    }

    return match[0];
  }

  async confirmOrder() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };
