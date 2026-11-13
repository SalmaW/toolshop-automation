const { test } = require("@playwright/test");

const { LoginPage } = require("../../pages/LoginPage");
const { AccountPage } = require("../../pages/AccountPage");
const { HomePage } = require("../../pages/HomePage");
const { ProductPage } = require("../../pages/ProductPage");
const { CheckoutPage } = require("../../pages/CheckoutPage");
const { NavBar } = require("../../pages/NavBar");

const journeyData = require("../../data/purchase-journey.json");

test.describe("Purchase journey", () => {
  test("TC-07: login, search, cart, checkout and pay", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);
    const navBar = new NavBar(page);

    await test.step("Login", async () => {
      await loginPage.goto();
      await loginPage.expectLoginFormVisible();
      await loginPage.login(journeyData.email, journeyData.password);
      await accountPage.expectAccountPage();
      await navBar.expectUserNameVisible(journeyData.customerName);
    });

    await test.step("Search", async () => {
      await homePage.goto();
      await homePage.searchFor(journeyData.searchTerm);
      await homePage.expectSearchResults(journeyData);
    });

    await test.step("Add to cart", async () => {
      const searchPrice = await homePage.getSearchResultPrice(
        journeyData.productName,
      );
      await homePage.openProduct(journeyData.productName);
      await productPage.expectProductDetails(journeyData.productName, searchPrice);

      await productPage.addToCart();
      await productPage.expectProductAddedToCart(journeyData.expectedToast);
      await navBar.expectCartCount(journeyData.quantity);
    });

    await test.step("Cart", async () => {
      await navBar.openCart();
      await checkoutPage.expectCartItem(
        journeyData.productName,
        journeyData.quantity,
      );
      await checkoutPage.expectCartPrices(journeyData.quantity);
    });

    await test.step("Checkout", async () => {
      await checkoutPage.proceedFromCart();
      await checkoutPage.expectSignInStepSkipped(journeyData.customerName);

      await checkoutPage.proceedFromSignIn();
      await checkoutPage.expectBillingStepVisible();
      await checkoutPage.expectBillingAddressPrefilled(journeyData.billingAddress);
      await checkoutPage.completeBillingAddress(journeyData.billingAddress);
    });

    await test.step("Pay", async () => {
      await checkoutPage.proceedFromBilling();
      await checkoutPage.expectPaymentStepVisible();

      await checkoutPage.selectPaymentMethod(journeyData.paymentMethod);
      await checkoutPage.finishPayment();
      await checkoutPage.expectPaymentSuccessful();
    });

    await test.step("Order confirmed with an invoice number", async () => {
      await checkoutPage.confirmOrder();
      await checkoutPage.expectOrderConfirmation();
      await checkoutPage.getInvoiceNumber();
    });
  });
});
