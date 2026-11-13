const { test } = require("@playwright/test");
const { randomUUID } = require("node:crypto");

const { RegisterPage } = require("../../pages/RegisterPage");
const { LoginPage } = require("../../pages/LoginPage");
const { AccountPage } = require("../../pages/AccountPage");
const { NavBar } = require("../../pages/NavBar");

const registrationData = require("../../data/registration.json");

test("TC-01: Registration", async ({ page }) => {
  // Generate unique customer email
  const customer = {
    ...registrationData,
    email: `${registrationData.emailPrefix}.${randomUUID()}@${registrationData.emailDomain}`,
  };

  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);
  const navBar = new NavBar(page);

  // 1. Register a new customer
  await registerPage.goto();
  await registerPage.register(customer);

  console.log("Registered customer email:", customer.email);

  // 2. Verify redirection to login page
  await registerPage.expectRedirectedToLogin();
  await loginPage.expectLoginFormVisible();

  // 3. Log in with the newly registered customer
  await loginPage.login(customer.email, customer.password);

  // 4. Verify My Account page
  await accountPage.expectAccountPage();

  // 5. Verify customer's name in navigation menu
  const customerName = `${customer.firstName} ${customer.lastName}`;
  await navBar.expectUserNameVisible(customerName);
});
