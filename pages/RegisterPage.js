const { expect } = require("@playwright/test");

class RegisterPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.firstNameInput = page.getByTestId("first-name");
    this.lastNameInput = page.getByTestId("last-name");
    this.dateOfBirthInput = page.getByTestId("dob");
    this.countrySelect = page.getByTestId("country");
    this.postalCodeInput = page.getByTestId("postal_code");
    this.houseNumberInput = page.getByTestId("house_number");
    this.streetInput = page.getByTestId("street");
    this.cityInput = page.getByTestId("city");
    this.stateInput = page.getByTestId("state");
    this.phoneInput = page.getByTestId("phone");
    this.emailInput = page.getByTestId("email");
    this.passwordInput = page.getByTestId("password");
    this.registerButton = page.getByTestId("register-submit");
  }

  // Actions
  async goto() {
    await this.page.goto("/auth/register");
  }

  async register(customer) {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.dateOfBirthInput.fill(customer.dateOfBirth);

    await this.countrySelect.selectOption(customer.country);
    await this.postalCodeInput.fill(customer.postalCode);
    await this.houseNumberInput.fill(customer.houseNumber);

    await this.streetInput.fill(customer.street);
    await this.cityInput.fill(customer.city);
    await this.stateInput.fill(customer.state);

    await this.phoneInput.fill(customer.phone);
    await this.emailInput.fill(customer.email);
    await this.passwordInput.fill(customer.password);

    await this.registerButton.click();
  }

  // Assertions
  async expectRedirectedToLogin() {
    await expect(this.page).toHaveURL(/\/auth\/login\/?$/);
  }
}

module.exports = { RegisterPage };
