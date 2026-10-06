import { expect, Page } from '@playwright/test';
import { HomePageStore } from '../ui-store/HomePageStore';
import { config } from '../utils/config';
import { logger } from '../utils/logger';
import { runReport } from '../utils/runReport';
import { webDriverHelper } from '../utils/webDriverHelper';

/**
 * Author: Subham Maharana
 * Method Name: HomePage
 * Description: Page object for ExportersIndia homepage navigation.
 * Parameters: page - Playwright page
 * Return Type: HomePage instance
 */
export class HomePage {
  private readonly page: Page;
  private readonly uiStore: HomePageStore;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes the homepage page object and its UI store.
   * Parameters: page - Playwright page
   * Return Type: void
   */
  constructor(page: Page) {
    try {
      this.page = page;
      this.uiStore = new HomePageStore(page);
    } catch (error) {
      console.error(`HomePage initialization failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: open
   * Description: Opens ExportersIndia homepage and verifies the search input.
   * Parameters: testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async open(testCaseId: string): Promise<void> {
    try {
      logger.info(`${testCaseId} - Opening homepage`);
      runReport.record('INFO', testCaseId, 'Opening homepage');
      await this.page.goto(config.baseUrl);
      await this.page.waitForLoadState('domcontentloaded');
      await webDriverHelper.verifyVisible(this.uiStore.SEARCH_INPUT, testCaseId, 'Homepage search input');
    } catch (error) {
      logger.error(`${testCaseId} - Homepage open failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: openPostBuyRequirement
   * Description: Hovers over For Buyer, clicks Post Buy Requirement and verifies navigation.
   * Parameters: testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async openPostBuyRequirement(testCaseId: string): Promise<void> {
    try {
      await this.open(testCaseId);
      logger.info(`${testCaseId} - Start: open Post Buy Requirement`);
      runReport.record('INFO', testCaseId, 'Start: open Post Buy Requirement');
      await expect(this.uiStore.FOR_BUYER).toBeVisible();
      await this.uiStore.FOR_BUYER.hover();
      const postBuyLink = this.page.locator('a[href*="post-buy-requirement"]:visible').first();
      if (await postBuyLink.count() > 0) {
        await expect(postBuyLink).toBeVisible();
        await postBuyLink.click();
      } else {
        const menuOption = this.page.getByText('Post Buy Requirement', { exact: true }).first();
        await expect(menuOption).toBeVisible();
        await menuOption.click();
      }
      await webDriverHelper.verifyUrl(this.page, config.requirementPath, testCaseId);
      runReport.record('PASS', testCaseId, 'Post Buy Requirement navigation verified');
    } catch (error) {
      logger.error(`${testCaseId} - Post Buy Requirement navigation failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }
}
