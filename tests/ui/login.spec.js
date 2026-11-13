const { test } = require("@playwright/test");

const { LoginPage } = require("../../pages/LoginPage");
const { AccountPage } = require("../../pages/AccountPage");
const { NavBar } = require("../../pages/NavBar");

const loginData = require("../../data/login.json");

test.describe("Login", () => {
  // Precondition: Open the login page
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.expectLoginFormVisible();
  });

  test("TC-02: should log in with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);
    const navBar = new NavBar(page);

    await loginPage.login(loginData.email, loginData.password);

    await accountPage.expectAccountPage();
    await navBar.expectUserNameVisible(loginData.name);
  });
});
