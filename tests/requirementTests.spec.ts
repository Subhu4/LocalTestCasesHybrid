import { test } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { RequirementPage } from './pages/RequirementPage';
import { jsonReader } from './utils/jsonReader';
import { executeTest } from './utils/testExecutor';

test('TS_0061 - Open Post Buy Requirement workflow', async ({ page }) => {
  await executeTest(page, 'TS_0061', async () => {
    const tc = jsonReader.getTestCase('TS_0061');
    const homePage = new HomePage(page);
    const requirementPage = new RequirementPage(page);
    await homePage.openPostBuyRequirement(tc.testCaseId);
    await requirementPage.verifyCoreFields(tc.testCaseId);
  });
});

test('TS_0062 - Submit a complete buyer requirement with valid data', async ({ page }) => {
  await executeTest(page, 'TS_0062', async () => {
    const tc = jsonReader.getTestCase('TS_0062');
    const data = jsonReader.getTestDataMap(tc);
    const homePage = new HomePage(page);
    const requirementPage = new RequirementPage(page);
    await homePage.openPostBuyRequirement(tc.testCaseId);
    await requirementPage.fillProduct(data.product as string, tc.testCaseId);
    await requirementPage.selectInterestedInIfAvailable(data.interestedIn as string, tc.testCaseId);
    await requirementPage.fillQuantity(data.quantity as string, tc.testCaseId);
    await requirementPage.selectUnit(data.unit as string, tc.testCaseId);
    await requirementPage.selectSupplierPreference(data.supplierPreference as string, tc.testCaseId);
    await requirementPage.fillMobile(data.mobileNumber as string, tc.testCaseId);
    await requirementPage.submit(tc.testCaseId);
    await requirementPage.verifyOtpVisible(tc.testCaseId);
  });
});

test('TS_0063 - Validate missing product/service in buyer requirements', async ({ page }) => {
  await executeTest(page, 'TS_0063', async () => {
    const tc = jsonReader.getTestCase('TS_0063');
    const data = jsonReader.getTestDataMap(tc);
    const homePage = new HomePage(page);
    const requirementPage = new RequirementPage(page);
    await homePage.openPostBuyRequirement(tc.testCaseId);
    await requirementPage.fillProduct(data.product as string, tc.testCaseId);
    await requirementPage.fillQuantity(data.quantity as string, tc.testCaseId);
    await requirementPage.selectUnit(data.unit as string, tc.testCaseId);
    await requirementPage.selectSupplierPreference(data.supplierPreference as string, tc.testCaseId);
    await requirementPage.fillMobile(data.mobileNumber as string, tc.testCaseId);
    await requirementPage.submit(tc.testCaseId);
    await requirementPage.verifyNoOtpAndValidation(tc.testCaseId, page.locator('input[placeholder="Products / Services you are looking for"]').first());
  });
});

test('TS_0064 - Validate missing Interested in', async ({ page }) => {
  await executeTest(page, 'TS_0064', async () => {
    const tc = jsonReader.getTestCase('TS_0064');
    const data = jsonReader.getTestDataMap(tc);
    const homePage = new HomePage(page);
    const requirementPage = new RequirementPage(page);
    await homePage.openPostBuyRequirement(tc.testCaseId);
    await requirementPage.fillProduct(data.product as string, tc.testCaseId);
    await requirementPage.fillQuantity(data.quantity as string, tc.testCaseId);
    await requirementPage.selectUnit(data.unit as string, tc.testCaseId);
    await requirementPage.selectSupplierPreference(data.supplierPreference as string, tc.testCaseId);
    await requirementPage.fillMobile(data.mobileNumber as string, tc.testCaseId);
    await requirementPage.submit(tc.testCaseId);
    await requirementPage.verifyNoOtpAndValidation(tc.testCaseId, page.locator('input[placeholder="Quantity"]').first());
  });
});

test('TS_0065 - Validate missing quantity in buyer requirement', async ({ page }) => {
  await executeTest(page, 'TS_0065', async () => {
    const tc = jsonReader.getTestCase('TS_0065');
    const data = jsonReader.getTestDataMap(tc);
    const homePage = new HomePage(page);
    const requirementPage = new RequirementPage(page);
    await homePage.openPostBuyRequirement(tc.testCaseId);
    await requirementPage.fillProduct(data.product as string, tc.testCaseId);
    await requirementPage.selectInterestedInIfAvailable(data.interestedIn as string, tc.testCaseId);
    await requirementPage.fillQuantity(data.quantity as string, tc.testCaseId);
    await requirementPage.selectUnit(data.unit as string, tc.testCaseId);
    await requirementPage.selectSupplierPreference(data.supplierPreference as string, tc.testCaseId);
    await requirementPage.fillMobile(data.mobileNumber as string, tc.testCaseId);
    await requirementPage.submit(tc.testCaseId);
    await requirementPage.verifyNoOtpAndValidation(tc.testCaseId, page.locator('input[placeholder="Quantity"]').first());
  });
});

test('TS_0066 - Validate zero and negative quantity', async ({ page }) => {
  await executeTest(page, 'TS_0066', async () => {
    const tc = jsonReader.getTestCase('TS_0066');
    const data = jsonReader.getTestDataMap(tc);
    const quantities = [data.quantity as string, '-1'];
    const homePage = new HomePage(page);
    const requirementPage = new RequirementPage(page);
    await homePage.openPostBuyRequirement(tc.testCaseId);
    await requirementPage.fillProduct(data.product as string, tc.testCaseId);
    await requirementPage.selectInterestedInIfAvailable(data.interestedIn as string, tc.testCaseId);
    await requirementPage.fillQuantity(quantities[0] ?? data.quantity as string, tc.testCaseId);
    await requirementPage.selectUnit(data.unit as string, tc.testCaseId);
    await requirementPage.selectSupplierPreference(data.supplierPreference as string, tc.testCaseId);
    await requirementPage.fillMobile(data.mobileNumber as string, tc.testCaseId);
    await requirementPage.submit(tc.testCaseId);
    await requirementPage.verifyNoOtpAndValidation(tc.testCaseId, page.locator('input[placeholder="Quantity"]').first());
    await requirementPage.fillQuantity(quantities[1] ?? '-1', tc.testCaseId);
    await requirementPage.submit(tc.testCaseId);
    await requirementPage.verifyNoOtpAndValidation(tc.testCaseId, page.locator('input[placeholder="Quantity"]').first());
  });
});

test('TS_0067 - Validate supplier preference options', async ({ page }) => {
  await executeTest(page, 'TS_0067', async () => {
    const tc = jsonReader.getTestCase('TS_0067');
    const data = jsonReader.getTestDataMap(tc);
    const options = data.supplierPreferences as string[];
    const requirementPage = new RequirementPage(page);
    await requirementPage.open(tc.testCaseId);
    for (const option of options) {
      await requirementPage.selectSupplierPreference(option, tc.testCaseId);
      await page.getByText(option, { exact: true }).last().scrollIntoViewIfNeeded();
      await page.getByText(option, { exact: true }).last().isVisible();
    }
  });
});

test('TS_0068 - Select specific states for supplier preference', async ({ page }) => {
  await executeTest(page, 'TS_0068', async () => {
    const tc = jsonReader.getTestCase('TS_0068');
    const data = jsonReader.getTestDataMap(tc);
    const requirementPage = new RequirementPage(page);
    await requirementPage.open(tc.testCaseId);
    await requirementPage.selectSupplierPreference(data.supplierPreference as string, tc.testCaseId);
    await requirementPage.selectStates(data.states as string[], tc.testCaseId);
  });
});

test('TS_0069 - Validate invalid mobile in buyer requirement', async ({ page }) => {
  await executeTest(page, 'TS_0069', async () => {
    const tc = jsonReader.getTestCase('TS_0069');
    const data = jsonReader.getTestDataMap(tc);
    const homePage = new HomePage(page);
    const requirementPage = new RequirementPage(page);
    await homePage.openPostBuyRequirement(tc.testCaseId);
    await requirementPage.fillProduct(data.product as string, tc.testCaseId);
    await requirementPage.selectInterestedInIfAvailable(data.interestedIn as string, tc.testCaseId);
    await requirementPage.fillQuantity(data.quantity as string, tc.testCaseId);
    await requirementPage.selectUnit(data.unit as string, tc.testCaseId);
    await requirementPage.selectSupplierPreference(data.supplierPreference as string, tc.testCaseId);
    await requirementPage.fillMobile(data.mobileNumber as string, tc.testCaseId);
    await requirementPage.verifyMobileFormat(data.mobileNumber as string, tc.testCaseId);
    await requirementPage.submit(tc.testCaseId);
    await requirementPage.verifyNoOtpAndValidation(tc.testCaseId, page.locator('input[placeholder="Enter Mobile Number"]').first());
  });
});
