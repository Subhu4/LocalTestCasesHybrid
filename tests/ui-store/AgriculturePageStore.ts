import { Locator, Page } from '@playwright/test';

/**
 * Author: Subham Maharana
 * Method Name: AgriculturePageStore
 * Description: Stores agriculture buyer-page locators.
 * Parameters: page - Playwright page
 * Return Type: AgriculturePageStore instance
 */
export class AgriculturePageStore {
  public readonly PAGE_HEADING: Locator;
  public readonly CATEGORY_HEADINGS_CSS: Locator;
  public readonly CATEGORY_LINKS: Locator;
  public readonly BREADCRUMB: Locator;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes agriculture page locator definitions.
   * Parameters: page - Playwright page
   * Return Type: void
   */
  constructor(page: Page) {
    try {
      this.PAGE_HEADING = page.getByRole('heading', { name: 'Buyers for Agricultural Products & Equipment', exact: true }).first();
      this.CATEGORY_HEADINGS_CSS = page.locator('h3');
      this.CATEGORY_LINKS = page.getByRole('link');
      this.BREADCRUMB = page.getByRole('link', { name: 'Buyers', exact: true }).last();
    } catch (error) {
      console.error(`AgriculturePageStore initialization failed: ${String(error)}`);
      throw error;
    }
  }
}
