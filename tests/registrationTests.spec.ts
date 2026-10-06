import { test } from '@playwright/test';
import { BuyersPage } from './pages/BuyersPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { jsonReader } from './utils/jsonReader';
import { executeTest } from './utils/testExecutor';

test('TS_0080 - Connect With Genuine Buyers Opens Registration', async ({ page }) => {
  await executeTest(page, 'TS_0080', async () => {
    const tc = jsonReader.getTestCase('TS_0080');
    const buyersPage = new BuyersPage(page);
    const registrationPage = new RegistrationPage(page);
    await buyersPage.open(tc.testCaseId);
    await buyersPage.clickConnectWithGenuineBuyers(tc);
    await registrationPage.open(tc);
    await registrationPage.verifyRegistrationFields(tc);
  });
});
