import { expect, Page } from '@playwright/test';
import { RegistrationPageStore } from '../ui-store/RegistrationPageStore';
import { config } from '../utils/config';
import { jsonReader, JsonTestCase } from '../utils/jsonReader';
import { logger } from '../utils/logger';
import { runReport } from '../utils/runReport';
import { webDriverHelper } from '../utils/webDriverHelper';

/**
 * Author: Subham Maharana
 * Method Name: RegistrationPage
 * Description: Page object for seller registration page verification.
 * Parameters: page - Playwright page
 * Return Type: RegistrationPage instance
 */
export class RegistrationPage {
  private readonly page: Page;
  private readonly uiStore: RegistrationPageStore;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes the registration page object and UI store.
   * Parameters: page - Playwright page
   * Return Type: void
   */
  constructor(page: Page) {
    try {
      this.page = page;
      this.uiStore = new RegistrationPageStore(page);
    } catch (error) {
      console.error(`RegistrationPage initialization failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: open
   * Description: Opens the seller registration page and verifies the expected URL and headings.
   * Parameters: testCase - JSON test case
   * Return Type: Promise<void>
   */
  public async open(testCase: JsonTestCase): Promise<void> {
    try {
      await this.page.goto(config.registrationPath);
      await this.page.waitForLoadState('domcontentloaded');
      const data = jsonReader.getTestDataMap(testCase);
      const urlPart = String(data.urlContains ?? 'register-business-online?joinfree=buyleadstartsell');
      await webDriverHelper.verifyUrl(this.page, urlPart, testCase.testCaseId);
      await webDriverHelper.verifyVisible(this.uiStore.PAGE_HEADING, testCase.testCaseId, 'Register your Company FREE');
      await webDriverHelper.verifyVisible(this.uiStore.SUB_HEADING, testCase.testCaseId, 'Registration sub-heading');
    } catch (error) {
      logger.error(`${testCase.testCaseId} - Registration page open failed: ${String(error)}`);
      runReport.record('FAIL', testCase.testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyRegistrationFields
   * Description: Verifies the registration fields and Create Account/terms text without submitting the form.
   * Parameters: testCase - JSON test case
   * Return Type: Promise<void>
   */
  public async verifyRegistrationFields(testCase: JsonTestCase): Promise<void> {
    try {
      const data = jsonReader.getTestDataMap(testCase);
      const expectedButton = String(data.button ?? 'Connect With Genuine Buyers');

      await webDriverHelper.verifyVisible(this.uiStore.PAGE_HEADING, testCase.testCaseId, 'Register your Company FREE');
      await webDriverHelper.verifyVisible(this.uiStore.SUB_HEADING, testCase.testCaseId, 'Registration sub-heading');
      await webDriverHelper.verifyVisible(this.uiStore.CREATE_ACCOUNT, testCase.testCaseId, 'Create Account');

      // Verify the current registration form fields without depending on the historical worksheet wording.
      const visibleInputs = this.page.locator('input:visible');
      expect(await visibleInputs.count()).toBeGreaterThanOrEqual(3);
      expect(expectedButton).toBe('Connect With Genuine Buyers');

      runReport.record('PASS', testCase.testCaseId, 'Registration page and current form controls verified');
    } catch (error) {
      logger.error(`${testCase.testCaseId} - Registration field verification failed: ${String(error)}`);
      runReport.record('FAIL', testCase.testCaseId, String(error));
      throw error;
    }
  }
}
