# Toolshop Purchase Flow – Playwright Automation

Automated UI tests for the purchase flow of [practicesoftwaretesting.com](https://practicesoftwaretesting.com),
written with **Playwright + JavaScript** using the **Page Object Model**.

Flow covered: register → log in → search for *Thor Hammer* → add to cart → checkout → pay → confirm order.

## Requirements

- Node.js 18 or newer
- Internet access (the tests run against the live demo site)

## Setup

```bash
npm install
npx playwright install chromium
```

## Running the tests

| Command               | What it runs                     |
| --------------------- | -------------------------------- |
| `npm test`            | All tests (headless)             |
| `npm run test:headed` | All tests in a visible browser   |
| `npm run test:ui`     | UI feature tests only (TC-01..06)|
| `npm run test:e2e`    | End-to-end journey only (TC-07)  |
| `npm run report`      | Opens the last HTML report       |

Run a single test case by its ID:

```bash
npx playwright test -g "TC-05"
```

Run in parallel with 4 workers:

```bash
npx playwright test --workers=4
```

## Test cases

| ID    | Spec                              | Precondition (`beforeEach`)    | What it checks |
| ----- | --------------------------------- | ------------------------------ | -------------- |
| TC-01 | `tests/ui/registration.spec.js`   | none (unique email per run)    | Redirect to login after registering; My account page and user name after login |
| TC-02 | `tests/ui/login.spec.js`          | Open login page                | URL `/account`, "My account" heading, user name in menu |
| TC-03 | `tests/ui/search.spec.js`         | Log in                         | Caption "Searched for: Thor Hammer", exactly 1 result |
| TC-04 | `tests/ui/cart.spec.js`           | Log in                         | Name/price match the search card, toast, cart badge = 1 |
| TC-05 | `tests/ui/cart.spec.js`           | Log in + add Thor Hammer       | One cart line, line price = unit × qty, total = line price |
| TC-06 | `tests/ui/checkout.spec.js`       | Log in + add Thor Hammer       | Every checkout step, invoice number, invoice in My invoices |
| TC-07 | `tests/e2e/purchase-journey.spec.js` | none                        | Full journey in `test.step()`s, order confirmed with invoice |

<img width="743" height="607" alt="image" src="https://github.com/user-attachments/assets/160621b6-15fc-4cbc-a485-1c0c53f2a7f4" />


## Project structure

```
pages/        Page objects – locators in the constructor, then actions, then expect...() checks
tests/ui/     One spec per feature (TC-01 .. TC-06)
tests/e2e/    Full purchase journey (TC-07)
data/         One JSON file per spec with the test data
```

Rules followed:

- Specs contain no locators; all `expect()` calls live in page objects.
- No `waitForTimeout`, no `nth()` / `first()`, no hard-coded product ids or prices.
- All test data lives in `data/*.json`; registration generates a unique email every run.
- Every test is independent and passes alone and in parallel.
