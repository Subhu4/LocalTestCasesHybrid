import { Locator, Page } from '@playwright/test';

/**
 * Author: Subham Maharana
 * Method Name: RegistrationPageStore
 * Description: Stores seller registration locators using built-in and CSS locators.
 * Parameters: page - Playwright page
 * Return Type: RegistrationPageStore instance
 */
export class RegistrationPageStore {
  public readonly PAGE_HEADING: Locator;
  public readonly SUB_HEADING: Locator;
  public readonly YOUR_NAME: Locator;
  public readonly COMPANY_NAME: Locator;
  public readonly MOBILE_NUMBER: Locator;
  public readonly EMAIL_ADDRESS: Locator;
  public readonly COMPANY_CITY: Locator;
  public readonly CREATE_ACCOUNT: Locator;
  public readonly TERMS_TEXT: Locator;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes registration page locator definitions.
   * Parameters: page - Playwright page
   * Return Type: void
   */
  constructor(page: Page) {
    try {
      this.PAGE_HEADING = page.getByRole('heading', { name: 'Register your Company FREE', exact: true }).first();
      this.SUB_HEADING = page.getByRole('heading', { name: 'Get Verified Buyers for your Product, FREE!', exact: true }).first();
      this.YOUR_NAME = page.getByAltText('Your Name', { exact: true }).first();
      this.COMPANY_NAME = page.getByAltText('Company Name', { exact: true }).first();
      this.MOBILE_NUMBER = page.getByText('Mobile Number', { exact: true }).first();
      this.EMAIL_ADDRESS = page.getByAltText('Email Address', { exact: true }).first();
      this.COMPANY_CITY = page.getByAltText('Company City', { exact: true }).first();
      this.CREATE_ACCOUNT = page.getByRole('button', { name: 'Create Account', exact: true }).first();
      this.TERMS_TEXT = page.getByText(/By clicking Create Account, I accept the T&C and Privacy Policy/i).first();
    } catch (error) {
      console.error(`RegistrationPageStore initialization failed: ${String(error)}`);
      throw error;
    }
  }
}
