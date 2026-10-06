import { Locator, Page } from '@playwright/test';

/**
 * Author: Subham Maharana
 * Method Name: BuyersPageStore
 * Description: Stores buyers page locators using Playwright built-in and CSS locators.
 * Parameters: page - Playwright page
 * Return Type: BuyersPageStore instance
 */
export class BuyersPageStore {
  public readonly PAGE_HEADING: Locator;
  public readonly INTRO_TEXT: Locator;
  public readonly SEARCH_BUY_LEADS: Locator;
  public readonly FOR_BUYER: Locator;
  public readonly MENU_OPTIONS: Locator;
  public readonly INDUSTRY_HEADING: Locator;
  public readonly INDUSTRY_LINKS_CSS: Locator;
  public readonly POPULAR_PRODUCTS_HEADING: Locator;
  public readonly POPULAR_PRODUCTS_CSS: Locator;
  public readonly LATEST_HEADING: Locator;
  public readonly LEAD_HEADINGS: Locator;
  public readonly LEAD_CARDS_CSS: Locator;
  public readonly CONNECT_GENUINE_BUYERS: Locator;
  public readonly SUPPORT_TEXT_CSS: Locator;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes buyers page locator definitions.
   * Parameters: page - Playwright page
   * Return Type: void
   */
  constructor(page: Page) {
    try {
      this.PAGE_HEADING = page.getByRole('heading', { name: 'Buy Leads & Trade Leads from Verified Buyers', exact: true }).first();
      this.INTRO_TEXT = page.getByText('Access verified buy leads and trade leads by industry to connect with serious global buyers and grow your business faster.', { exact: true }).first();
      this.SEARCH_BUY_LEADS = page.getByText('Search Buy Leads', { exact: true }).first();
      this.FOR_BUYER = page.getByText('For Buyer', { exact: true }).first();
      this.MENU_OPTIONS = page.getByRole('link', { name: /^(Post Buy Requirement|Browse Suppliers|Manufacturers Directory|Country Suppliers|Buyer FAQ)$/ });
      this.INDUSTRY_HEADING = page.getByRole('heading', { name: 'Explore Buy Leads by Industry', exact: true }).first();
      this.INDUSTRY_LINKS_CSS = page.locator('a[href^="/buyers/"][href$=".htm"]');
      this.POPULAR_PRODUCTS_HEADING = page.getByRole('heading', { name: 'Purchase Leads Across Popular Products', exact: true }).first();
      this.POPULAR_PRODUCTS_CSS = page.locator('a[href^="/buyers/"][href$=".htm"]');
      this.LATEST_HEADING = page.getByRole('heading', { name: 'Latest Buy Leads from Verified & Genuine Buyers', exact: true }).first();
      this.LEAD_HEADINGS = page.getByRole('heading', { name: /Looking for/i });
      this.LEAD_CARDS_CSS = page.locator('div:has(> h3)').filter({ hasText: /Looking for/i });
      this.CONNECT_GENUINE_BUYERS = page.getByRole('link', { name: 'Connect With Genuine Buyers', exact: true }).first();
      this.SUPPORT_TEXT_CSS = page.locator('header, body').filter({ hasText: /Call us|Support/i }).first();
    } catch (error) {
      console.error(`BuyersPageStore initialization failed: ${String(error)}`);
      throw error;
    }
  }
}
