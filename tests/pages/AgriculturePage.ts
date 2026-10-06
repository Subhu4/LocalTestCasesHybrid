import { expect, Page } from '@playwright/test';
import { AgriculturePageStore } from '../ui-store/AgriculturePageStore';
import { config } from '../utils/config';
import { jsonReader, JsonTestCase } from '../utils/jsonReader';
import { logger } from '../utils/logger';
import { runReport } from '../utils/runReport';
import { webDriverHelper } from '../utils/webDriverHelper';

/**
 * Author: Subham Maharana
 * Method Name: AgriculturePage
 * Description: Page object for the agricultural buyer directory.
 * Parameters: page - Playwright page
 * Return Type: AgriculturePage instance
 */
export class AgriculturePage {
  private readonly page: Page;
  private readonly uiStore: AgriculturePageStore;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes the agriculture page object and UI store.
   * Parameters: page - Playwright page
   * Return Type: void
   */
  constructor(page: Page) {
    try {
      this.page = page;
      this.uiStore = new AgriculturePageStore(page);
    } catch (error) {
      console.error(`AgriculturePage initialization failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: open
   * Description: Opens the agriculture buyer directory and verifies the expected heading.
   * Parameters: testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async open(testCaseId: string): Promise<void> {
    try {
      await this.page.goto(config.agriculturePath);
      await this.page.waitForLoadState('domcontentloaded');
      await webDriverHelper.verifyVisible(this.uiStore.PAGE_HEADING, testCaseId, 'Agriculture buyers heading');
    } catch (error) {
      logger.error(`${testCaseId} - Agriculture page open failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyBreadcrumbAndCategories
   * Description: Verifies the agriculture URL, category count, named categories and numeric counts.
   * Parameters: testCase - JSON test case
   * Return Type: Promise<void>
   */
  public async verifyBreadcrumbAndCategories(testCase: JsonTestCase): Promise<void> {
    try {
      const data = jsonReader.getTestDataMap(testCase);
      const expectedUrl = String(data.url ?? config.agriculturePath);
      const expectedHeading = String(data.heading ?? 'Buyers for Agricultural Products & Equipment');
      await webDriverHelper.verifyUrl(this.page, expectedUrl, testCase.testCaseId);
      await webDriverHelper.verifyVisible(this.uiStore.PAGE_HEADING, testCase.testCaseId, expectedHeading);

      const categoryNames = [
        'Bird, Poultry & Animal Feed',
        'Seeds & Plant Saplings',
        'Fresh Flowers & Plants',
        'Fertilizers & Soil Additives',
        'Pets & Farm Animals',
        'Coir & Agro Products',
        'Farming Tools, Equipment & Machines',
        'Tractors & Tractor Parts',
        'Agricultural Irrigation & Harvesting Equipment',
        'Pesticides & Insecticides'
      ];

      for (const category of categoryNames) {
        const heading = this.page.getByRole('heading', { name: new RegExp(`^${this.escapeRegExp(category)}\\s*\\(`) }).first();
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/\(\d+\)/);
      }

      expect(await this.uiStore.CATEGORY_HEADINGS_CSS.filter({ hasText: /\(\d+\)/ }).count()).toBeGreaterThanOrEqual(10);
      runReport.record('PASS', testCase.testCaseId, 'Agriculture breadcrumb/category content verified');
    } catch (error) {
      logger.error(`${testCase.testCaseId} - Agriculture category verification failed: ${String(error)}`);
      runReport.record('FAIL', testCase.testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: escapeRegExp
   * Description: Escapes a category name for a regular expression.
   * Parameters: value - category name
   * Return Type: string
   */
  private escapeRegExp(value: string): string {
    try {
      return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    } catch (error) {
      logger.error(`Agriculture regex escaping failed: ${String(error)}`);
      throw error;
    }
  }
}
