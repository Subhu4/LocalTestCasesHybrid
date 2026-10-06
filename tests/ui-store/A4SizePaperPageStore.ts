import { Locator, Page } from '@playwright/test';

/**
 * Author: Subham Maharana
 * Method Name: A4SizePaperPageStore
 * Description: Stores A4 size paper buyer-page locators.
 * Parameters: page - Playwright page
 * Return Type: A4SizePaperPageStore instance
 */
export class A4SizePaperPageStore {
  public readonly PAGE_HEADING: Locator;
  public readonly LEAD_HEADINGS: Locator;
  public readonly CONTACT_BUYER: Locator;
  public readonly SHOW_MORE_RESULT: Locator;
  public readonly BREADCRUMB_BUYERS: Locator;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes A4 page locator definitions.
   * Parameters: page - Playwright page
   * Return Type: void
   */
  constructor(page: Page) {
    try {
      this.PAGE_HEADING = page.getByRole('heading', { name: 'A4 Size Paper Buy Leads', exact: true }).first();
      this.LEAD_HEADINGS = page.getByRole('heading', { name: /Looking for/i });
      this.CONTACT_BUYER = page.getByText('Contact Buyer', { exact: true });
      this.SHOW_MORE_RESULT = page.getByText('Show More Result', { exact: true }).first();
      this.BREADCRUMB_BUYERS = page.getByRole('link', { name: 'Buyers', exact: true }).last();
    } catch (error) {
      console.error(`A4SizePaperPageStore initialization failed: ${String(error)}`);
      throw error;
    }
  }
}
