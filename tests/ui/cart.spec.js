const { test } = require("@playwright/test");

const { LoginPage } = require("../../pages/LoginPage");
const { AccountPage } = require("../../pages/AccountPage");
const { HomePage } = require("../../pages/HomePage");
const { ProductPage } = require("../../pages/ProductPage");
const { NavBar } = require("../../pages/NavBar");
const { CheckoutPage } = require("../../pages/CheckoutPage");

const cartData = require("../../data/cart.json");

test.describe("Cart", () => {
  // Shared precondition for TC-04 and TC-05: Log in
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);

    await loginPage.goto();
    await loginPage.expectLoginFormVisible();
    await loginPage.login(cartData.email, cartData.password);
    await accountPage.expectAccountPage();
  });

  test("TC-04: should add Thor Hammer to cart", async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const navBar = new NavBar(page);

    await homePage.goto();
    await homePage.searchFor(cartData.searchTerm);

    // Remember the price shown on the search card
    const searchPrice = await homePage.getSearchResultPrice(cartData.productName);

    await homePage.openProduct(cartData.productName);
    await productPage.expectProductDetails(cartData.productName, searchPrice);

    await productPage.addToCart();
    await productPage.expectProductAddedToCart(cartData.expectedToast);
    await navBar.expectCartCount(cartData.expectedCartCount);
  });

  test.describe("with Thor Hammer in the cart", () => {
    // Extra precondition for TC-05: add Thor Hammer to the cart
    test.beforeEach(async ({ page }) => {
      const homePage = new HomePage(page);
      const productPage = new ProductPage(page);
      const navBar = new NavBar(page);

      await homePage.goto();
      await homePage.searchFor(cartData.searchTerm);
      await homePage.openProduct(cartData.productName);
      await productPage.addToCart();
      await productPage.expectProductAddedToCart(cartData.expectedToast);
      await navBar.expectCartCount(cartData.expectedCartCount);
    });

    test("TC-05: should show correct cart line and totals", async ({ page }) => {
      const navBar = new NavBar(page);
      const checkoutPage = new CheckoutPage(page);

      await navBar.openCart();

      // One line: Thor Hammer x 1
      await checkoutPage.expectCartItem(
        cartData.productName,
        cartData.expectedQuantity,
      );

      // Line price = unit price x quantity, total = line price
      await checkoutPage.expectCartPrices(cartData.expectedQuantity);
    });
  });
});
