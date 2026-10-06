import { Locator, Page } from '@playwright/test';

/**
 * Author: Subham Maharana
 * Method Name: HomePageStore
 * Description: Stores homepage locators using Playwright built-in and CSS locators.
 * Parameters: page - Playwright page
 * Return Type: HomePageStore instance
 */
export class HomePageStore {
  public readonly FOR_BUYER: Locator;
  public readonly POST_BUY_REQUIREMENT: Locator;
  public readonly SEARCH_INPUT: Locator;
  public readonly SEARCH_INPUT_CSS: Locator;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes homepage locator definitions.
   * Parameters: page - Playwright page
   * Return Type: void
   */
  constructor(page: Page) {
    try {
      this.FOR_BUYER = page.getByText('For Buyer', { exact: true }).first();
      this.POST_BUY_REQUIREMENT = page.getByRole('link', { name: 'Post Buy Requirement', exact: true }).first();
      this.SEARCH_INPUT = page.getByPlaceholder('Enter product / service to search').first();
      this.SEARCH_INPUT_CSS = page.locator('input[placeholder="Enter product / service to search"]').first();
    } catch (error) {
      console.error(`HomePageStore initialization failed: ${String(error)}`);
      throw error;
    }
  }
}
