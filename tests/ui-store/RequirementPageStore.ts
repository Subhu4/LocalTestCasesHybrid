import { Locator, Page } from '@playwright/test';

/**
 * Author: Subham Maharana
 * Method Name: RequirementPageStore
 * Description: Stores buyer requirement form locators using Playwright built-in and CSS locators.
 * Parameters: page - Playwright page
 * Return Type: RequirementPageStore instance
 */
export class RequirementPageStore {
  public readonly REQUIREMENT_DETAILS: Locator;
  public readonly PRODUCT_SERVICE: Locator;
  public readonly PRODUCT_SERVICE_CSS: Locator;
  public readonly QUANTITY: Locator;
  public readonly QUANTITY_CSS: Locator;
  public readonly UNIT_SELECT_CSS: Locator;
  public readonly UNIT_LABEL: Locator;
  public readonly UNIT_INPUT: Locator;
  public readonly MOBILE: Locator;
  public readonly MOBILE_CSS: Locator;
  public readonly SUBMIT_REQUIREMENT: Locator;
  public readonly OTP_TEXT: Locator;
  public readonly VALIDATION_MESSAGES: Locator;
  public readonly INTERESTED_IN_TEXT: Locator;
  public readonly STATE_SELECT_CSS: Locator;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes requirement form locator definitions.
   * Parameters: page - Playwright page
   * Return Type: void
   */
  constructor(page: Page) {
    try {
      this.REQUIREMENT_DETAILS = page.getByText('Requirement Details', { exact: true }).first();
      this.PRODUCT_SERVICE = page.getByPlaceholder('Products / Services you are looking for').first();
      this.PRODUCT_SERVICE_CSS = page.locator('input[placeholder="Products / Services you are looking for"]').first();
      this.QUANTITY = page.getByPlaceholder('Quantity').first();
      this.QUANTITY_CSS = page.locator('input[placeholder="Quantity"]').first();
      this.UNIT_SELECT_CSS = page.locator('select#quantity_unit, select[name*="unit" i]').first();
      this.UNIT_LABEL = page.getByText('Unit of Measurement', { exact: true }).first();
      this.UNIT_INPUT = page.locator('input[placeholder="Unit of Measurement"]').first();
      this.MOBILE = page.getByPlaceholder('Enter Mobile Number').first();
      this.MOBILE_CSS = page.locator('input[placeholder="Enter Mobile Number"]').first();
      this.SUBMIT_REQUIREMENT = page.getByRole('button', { name: 'Submit Requirement', exact: true }).first();
      this.OTP_TEXT = page.getByText(/one.?time password|OTP/i).first();
      this.VALIDATION_MESSAGES = page.locator('.error, .error-msg, .validation, .invalid-feedback, [class*="error" i], [class*="invalid" i]');
      this.INTERESTED_IN_TEXT = page.getByText('Interested in', { exact: true }).first();
      this.STATE_SELECT_CSS = page.locator('select[name*="state" i], select[id*="state" i]').first();
    } catch (error) {
      console.error(`RequirementPageStore initialization failed: ${String(error)}`);
      throw error;
    }
  }
}
