const { test } = require("@playwright/test");

const { LoginPage } = require("../../pages/LoginPage");
const { AccountPage } = require("../../pages/AccountPage");
const { HomePage } = require("../../pages/HomePage");
const { ProductPage } = require("../../pages/ProductPage");
const { CheckoutPage } = require("../../pages/CheckoutPage");
const { NavBar } = require("../../pages/NavBar");
const { InvoicesPage } = require("../../pages/InvoicesPage");

const checkoutData = require("../../data/checkout.json");

test.describe("Checkout", () => {
  // Precondition: Log in + add Thor Hammer to cart
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const navBar = new NavBar(page);

    await loginPage.goto();
    await loginPage.expectLoginFormVisible();
    await loginPage.login(checkoutData.email, checkoutData.password);
    await accountPage.expectAccountPage();

    await homePage.goto();
    await homePage.searchFor(checkoutData.searchTerm);
    await homePage.openProduct(checkoutData.productName);
    await productPage.addToCart();
    await productPage.expectProductAddedToCart(checkoutData.expectedToast);
    await navBar.expectCartCount(checkoutData.quantity);
  });

  test("TC-06: should complete checkout and list the invoice", async ({
    page,
  }) => {
    const checkoutPage = new CheckoutPage(page);
    const navBar = new NavBar(page);
    const invoicesPage = new InvoicesPage(page);

    await test.step("1. Cart line is correct", async () => {
      await navBar.openCart();
      await checkoutPage.expectCartItem(
        checkoutData.productName,
        checkoutData.quantity,
      );
      await checkoutPage.expectCartPrices(checkoutData.quantity);
    });

    await test.step("2. Sign-in step is skipped (already logged in)", async () => {
      await checkoutPage.proceedFromCart();
      await checkoutPage.expectSignInStepSkipped(checkoutData.customerName);
    });

    await test.step("3. Billing address is prefilled with the user's data", async () => {
      await checkoutPage.proceedFromSignIn();
      await checkoutPage.expectBillingStepVisible();
      await checkoutPage.expectBillingAddressPrefilled(checkoutData.billingAddress);

      await checkoutPage.completeBillingAddress(checkoutData.billingAddress);
    });

    await test.step("4. Payment was successful", async () => {
      await checkoutPage.proceedFromBilling();
      await checkoutPage.expectPaymentStepVisible();

      await checkoutPage.selectPaymentMethod(checkoutData.paymentMethod);
      await checkoutPage.finishPayment();
      await checkoutPage.expectPaymentSuccessful(
        checkoutData.expectedPaymentMessage,
      );
    });

    let invoiceNumber;

    await test.step("5. Order is confirmed with an invoice number", async () => {
      await checkoutPage.confirmOrder();
      await checkoutPage.expectOrderConfirmation();
      invoiceNumber = await checkoutPage.getInvoiceNumber();
    });

    await test.step("6. Invoice is listed in My invoices", async () => {
      await navBar.openMyInvoices();
      await invoicesPage.expectInvoiceListed(invoiceNumber);
    });
  });
});
