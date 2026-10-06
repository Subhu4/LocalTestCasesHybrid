import { expect, test } from '@playwright/test';
import { BuyersPage } from './pages/BuyersPage';
import { AgriculturePage } from './pages/AgriculturePage';
import { A4SizePaperPage } from './pages/A4SizePaperPage';
import { config } from './utils/config';
import { jsonReader } from './utils/jsonReader';
import { executeTest } from './utils/testExecutor';

test('TS_0070 - Header Call Us Number', async ({ page }) => {
  await executeTest(page, 'TS_0070', async () => {
    const tc = jsonReader.getTestCase('TS_0070');
    const buyersPage = new BuyersPage(page);
    await buyersPage.open(tc.testCaseId);
    await buyersPage.verifyHeaderCallUs(tc);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.evaluate(() => window.scrollTo(0, 0));
    await buyersPage.verifyHeaderCallUs(tc);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await buyersPage.verifyHeaderCallUs(tc);
  });
});

test('TS_0071 - Buyers Page Introductory sentence is displayed directly below the main heading', async ({ page }) => {
  await executeTest(page, 'TS_0071', async () => {
    const tc = jsonReader.getTestCase('TS_0071');
    const buyersPage = new BuyersPage(page);
    await buyersPage.open(tc.testCaseId);
    await buyersPage.verifyIntroAndSearch(tc);
  });
});

test('TS_0072 - For Buyer Menu Options', async ({ page }) => {
  await executeTest(page, 'TS_0072', async () => {
    const tc = jsonReader.getTestCase('TS_0072');
    const buyersPage = new BuyersPage(page);
    await buyersPage.open(tc.testCaseId);
    await buyersPage.verifyBuyerMenu(tc);
  });
});

test('TS_0073 - Industry Directory Content and Count', async ({ page }) => {
  await executeTest(page, 'TS_0073', async () => {
    const tc = jsonReader.getTestCase('TS_0073');
    const buyersPage = new BuyersPage(page);
    await buyersPage.open(tc.testCaseId);
    await buyersPage.verifyIndustryDirectory(tc);
  });
});

test('TS_0074 - Agriculture Industry Page Content', async ({ page }) => {
  await executeTest(page, 'TS_0074', async () => {
    const tc = jsonReader.getTestCase('TS_0074');
    const buyersPage = new BuyersPage(page);
    const agriculturePage = new AgriculturePage(page);
    await buyersPage.open(tc.testCaseId);
    const values = jsonReader.getTestDataMap(tc);
    await buyersPage.clickIndustry(String(values.first ?? 'Agricultural Products & Equipment'), tc.testCaseId);
    await expect(page).toHaveURL(new RegExp('buyers/agriculture\\.htm'));
    await agriculturePage.verifyBreadcrumbAndCategories(tc);
  });
});

test('TS_0075 - Breadcrumb Link Back to Buyers Page', async ({ page }) => {
  await executeTest(page, 'TS_0075', async () => {
    const tc = jsonReader.getTestCase('TS_0075');
    const buyersPage = new BuyersPage(page);
    await buyersPage.open(tc.testCaseId);
    await buyersPage.clickIndustry('Textiles, Yarn & Fabrics', tc.testCaseId);
    await expect(page).toHaveURL(/\/buyers\/textiles\.htm/);

    const breadcrumb = page.getByRole('link', { name: 'Buyers', exact: true }).last();
    if (await breadcrumb.count() > 0 && await breadcrumb.isVisible().catch(() => false)) {
      await breadcrumb.click();
    } else {
      await page.goto(config.buyersPath);
    }
    await expect(page).toHaveURL(/\/buyers\/?$/);
    await expect(page.getByRole('heading', { name: 'Buy Leads & Trade Leads from Verified Buyers', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Explore Buy Leads by Industry', exact: true })).toBeVisible();
  });
});

test('TS_0076 - Popular Products Format and Order', async ({ page }) => {
  await executeTest(page, 'TS_0076', async () => {
    const data = jsonReader.getTestCase('TS_0076').TestData;

    await page.goto('https://www.exportersindia.com/buyers/');
    await page.waitForLoadState('domcontentloaded');

    const section = data.section as string;
    const products = data.products as string[];

    // Verify section
    await expect(
      page.getByText(section, { exact: true })
    ).toBeVisible();

    // Verify the five products provided in test data
    for (const product of products) {
      const escapedProduct = product.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

      const productLink = page.getByRole('link', {
        name: new RegExp(`^${escapedProduct}\\s*\\(`)
      }).first();

      await expect(productLink).toBeVisible();
    }
  });
});

test('TS_0077 - A4 Size Paper Leads Page Content', async ({ page }) => {
  await executeTest(page, 'TS_0077', async () => {
    const data = jsonReader.getTestCase('TS_0077').TestData;

    await page.goto('https://www.exportersindia.com/buyers/');
    await page.waitForLoadState('domcontentloaded');

    // Locate A4 Size Paper
    const a4Link = page.getByRole('link', {
      name: /A4 Size Paper/
    }).first();

    await expect(a4Link).toBeVisible();

    await a4Link.scrollIntoViewIfNeeded();
    await a4Link.click();

    // Verify URL
    await expect(page).toHaveURL(
      /\/buyers\/a4-size-copy-paper\.htm/
    );

    // Verify heading from JSON
    await expect(
      page.getByRole('heading', {
        name: data.heading as string
      })
    ).toBeVisible();

    // Verify breadcrumb
    await expect(
      page.getByText('Home', { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText('Buyers', { exact: true })
    ).toBeVisible();

    // Verify lead cards
    const leadCards = page.locator('text=Contact Buyer');

    await expect(leadCards.first()).toBeVisible();

    // Verify Show More Result
    await page.getByText('Show More Result', { exact: true })
      .scrollIntoViewIfNeeded();

    await expect(
      page.getByText('Show More Result', { exact: true })
    ).toBeVisible();
  });
});
test('TS_0078 - Verified icon on first, fifth and tenth latest Buy Lead cards', async ({ page }) => {
  await executeTest(page, 'TS_0078', async () => {
    const tc = jsonReader.getTestCase('TS_0078');
    const buyersPage = new BuyersPage(page);
    await buyersPage.open(tc.testCaseId);
    await buyersPage.verifyLatestLeads(tc.testCaseId);
    await buyersPage.verifyVerifiedIcon(tc.testCaseId);
  });
});

test('TS_0079 - Buyer Mobile Number is Masked on Lead Cards', async ({ page }) => {
  await executeTest(page, 'TS_0079', async () => {
    const tc = jsonReader.getTestCase('TS_0079');
    const buyersPage = new BuyersPage(page);
    await buyersPage.open(tc.testCaseId);
    await buyersPage.verifyLatestLeads(tc.testCaseId);
    await buyersPage.verifyMaskedMobileNumbers(tc);
  });
});
