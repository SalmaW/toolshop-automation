const { test } = require("@playwright/test");

const { LoginPage } = require("../../pages/LoginPage");
const { AccountPage } = require("../../pages/AccountPage");
const { HomePage } = require("../../pages/HomePage");

const searchData = require("../../data/search.json");

test.describe("Search", () => {
  // Precondition: Log in
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);

    await loginPage.goto();
    await loginPage.expectLoginFormVisible();
    await loginPage.login(searchData.email, searchData.password);

    // Wait until login has really finished before navigating away
    await accountPage.expectAccountPage();
  });

  test("TC-03: should find exactly one Thor Hammer result", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.searchFor(searchData.searchTerm);

    await homePage.expectSearchResults(searchData);
  });
});
