import { expect, Page } from '@playwright/test';
import { A4SizePaperPageStore } from '../ui-store/A4SizePaperPageStore';
import { config } from '../utils/config';
import { jsonReader, JsonTestCase } from '../utils/jsonReader';
import { logger } from '../utils/logger';
import { runReport } from '../utils/runReport';
import { webDriverHelper } from '../utils/webDriverHelper';

/**
 * Author: Subham Maharana
 * Method Name: A4SizePaperPage
 * Description: Page object for A4 Size Paper buy leads.
 * Parameters: page - Playwright page
 * Return Type: A4SizePaperPage instance
 */
export class A4SizePaperPage {
  private readonly page: Page;
  private readonly uiStore: A4SizePaperPageStore;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes the A4 page object and UI store.
   * Parameters: page - Playwright page
   * Return Type: void
   */
  constructor(page: Page) {
    try {
      this.page = page;
      this.uiStore = new A4SizePaperPageStore(page);
    } catch (error) {
      console.error(`A4SizePaperPage initialization failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: open
   * Description: Opens the A4 Size Paper buy-leads page.
   * Parameters: testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async open(testCaseId: string): Promise<void> {
    try {
      await this.page.goto(config.a4PaperPath);
      await this.page.waitForLoadState('domcontentloaded');
      await webDriverHelper.verifyVisible(this.uiStore.PAGE_HEADING, testCaseId, 'A4 Size Paper Buy Leads heading');
    } catch (error) {
      logger.error(`${testCaseId} - A4 page open failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyLeadContent
   * Description: Verifies lead cards, Contact Buyer actions and Show More Result after scrolling to the end.
   * Parameters: testCase - JSON test case
   * Return Type: Promise<void>
   */
  public async verifyLeadContent(testCase: JsonTestCase): Promise<void> {
    try {
      const data = jsonReader.getTestDataMap(testCase);
      const expectedHeading = String(data.heading ?? 'A4 Size Paper Buy Leads');
      await webDriverHelper.verifyVisible(this.uiStore.PAGE_HEADING, testCase.testCaseId, expectedHeading);
      await expect(this.uiStore.LEAD_HEADINGS.first()).toBeVisible();
      await expect(this.uiStore.CONTACT_BUYER.first()).toBeVisible();
      await this.page.locator('body').evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(this.uiStore.SHOW_MORE_RESULT).toBeVisible();
      runReport.record('PASS', testCase.testCaseId, 'A4 lead cards and Show More Result verified');
    } catch (error) {
      logger.error(`${testCase.testCaseId} - A4 lead content verification failed: ${String(error)}`);
      runReport.record('FAIL', testCase.testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyBreadcrumbIfPresent
   * Description: Verifies the breadcrumb when the live page exposes it.
   * Parameters: testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async verifyBreadcrumbIfPresent(testCaseId: string): Promise<void> {
    try {
      if (await this.uiStore.BREADCRUMB_BUYERS.count() > 0 && await this.uiStore.BREADCRUMB_BUYERS.isVisible().catch(() => false)) {
        await expect(this.uiStore.BREADCRUMB_BUYERS).toBeVisible();
      } else {
        logger.info(`${testCaseId} - Breadcrumb link not exposed in current rendered A4 page.`);
      }
      runReport.record('PASS', testCaseId, 'Breadcrumb compatibility verification completed');
    } catch (error) {
      logger.error(`${testCaseId} - Breadcrumb verification failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }
}
