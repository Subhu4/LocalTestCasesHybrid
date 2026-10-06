import { expect, Page } from '@playwright/test';
import { RequirementPageStore } from '../ui-store/RequirementPageStore';
import { config } from '../utils/config';
import { logger } from '../utils/logger';
import { runReport } from '../utils/runReport';
import { webDriverHelper } from '../utils/webDriverHelper';

/**
 * Author: Subham Maharana
 * Method Name: RequirementPage
 * Description: Page object for buyer requirement form actions and verification.
 * Parameters: page - Playwright page
 * Return Type: RequirementPage instance
 */
export class RequirementPage {
  private readonly page: Page;
  private readonly uiStore: RequirementPageStore;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes the requirement page object and UI store.
   * Parameters: page - Playwright page
   * Return Type: void
   */
  constructor(page: Page) {
    try {
      this.page = page;
      this.uiStore = new RequirementPageStore(page);
    } catch (error) {
      console.error(`RequirementPage initialization failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: open
   * Description: Opens the requirement page directly and verifies Requirement Details.
   * Parameters: testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async open(testCaseId: string): Promise<void> {
    try {
      logger.info(`${testCaseId} - Opening Requirement Details`);
      runReport.record('INFO', testCaseId, 'Opening Requirement Details');
      await this.page.goto(config.requirementPath);
      await this.page.waitForLoadState('domcontentloaded');
      await webDriverHelper.verifyVisible(this.uiStore.REQUIREMENT_DETAILS, testCaseId, 'Requirement Details');
    } catch (error) {
      logger.error(`${testCaseId} - Requirement page open failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyCoreFields
   * Description: Verifies the mandatory controls required by the buyer requirement workflow.
   * Parameters: testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async verifyCoreFields(testCaseId: string): Promise<void> {
    try {
      await webDriverHelper.verifyVisible(this.uiStore.PRODUCT_SERVICE, testCaseId, 'Product / Service field');
      await webDriverHelper.verifyVisible(this.uiStore.QUANTITY, testCaseId, 'Quantity field');
      const unitSelectorVisible = await this.uiStore.UNIT_LABEL.isVisible().catch(() => false);
      if (unitSelectorVisible) {
        await webDriverHelper.verifyVisible(this.uiStore.UNIT_LABEL, testCaseId, 'Unit of Measurement selector');
      } else {
        await webDriverHelper.verifyVisible(this.uiStore.UNIT_INPUT, testCaseId, 'Unit of Measurement selector');
      }
      await webDriverHelper.verifyVisible(this.uiStore.MOBILE, testCaseId, 'Mobile Number field');
      await webDriverHelper.verifyVisible(this.uiStore.SUBMIT_REQUIREMENT, testCaseId, 'Submit Requirement action');
      await webDriverHelper.verifyVisible(this.page.getByText('Supplier Preference', { exact: true }).first(), testCaseId, 'Supplier Preference section');
    } catch (error) {
      logger.error(`${testCaseId} - Core field verification failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: fillProduct
   * Description: Fills Product / Service and verifies the value.
   * Parameters: value - product/service value, testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async fillProduct(value: string, testCaseId: string): Promise<void> {
    try {
      await webDriverHelper.fillAndVerify(this.uiStore.PRODUCT_SERVICE_CSS, value, testCaseId, 'Product / Service');
    } catch (error) {
      logger.error(`${testCaseId} - Product fill failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: fillQuantity
   * Description: Fills Quantity and verifies the value.
   * Parameters: value - quantity value, testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async fillQuantity(value: string, testCaseId: string): Promise<void> {
    try {
      await webDriverHelper.fillAndVerify(this.uiStore.QUANTITY_CSS, value, testCaseId, 'Quantity');
    } catch (error) {
      logger.error(`${testCaseId} - Quantity fill failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: selectUnit
   * Description: Selects a unit from the native unit selector and verifies the selection.
   * Parameters: value - unit label, testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async selectUnit(value: string, testCaseId: string): Promise<void> {
    try {
      logger.info(`${testCaseId} - Start: select Unit ${value}`);
      runReport.record('INFO', testCaseId, `Start: select Unit ${value}`);
      const selector = this.uiStore.UNIT_SELECT_CSS;
      await expect(selector).toBeAttached();
      try {
        await selector.selectOption({ label: value });
      } catch {
        await selector.evaluate((element, unitValue) => {
          const select = element as HTMLSelectElement;
          const option = [...select.options].find((item) => item.text.trim() === String(unitValue));
          if (!option) {
            throw new Error(`Unit option not found: ${String(unitValue)}`);
          }
          select.value = option.value;
          option.selected = true;
          select.dispatchEvent(new Event('input', { bubbles: true }));
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }, value);
      }
      await expect(selector.locator('option:checked')).toHaveText(value);
      runReport.record('PASS', testCaseId, `Unit selected: ${value}`);
    } catch (error) {
      logger.error(`${testCaseId} - Unit selection failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: selectInterestedInIfAvailable
   * Description: Selects the Interested in option when the current live UI exposes it; otherwise records the UI change without inventing a control.
   * Parameters: value - interested-in value, testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async selectInterestedInIfAvailable(value: string, testCaseId: string): Promise<void> {
    try {
      logger.info(`${testCaseId} - Start: Interested in ${value}`);
      runReport.record('INFO', testCaseId, `Start: Interested in ${value}`);
      const option = this.page.getByText(value, { exact: true }).last();
      if (await option.count() > 0 && await option.isVisible().catch(() => false)) {
        await option.click();
        await expect(option).toBeVisible();
        runReport.record('PASS', testCaseId, `Interested in selected: ${value}`);
      } else {
        logger.info(`${testCaseId} - Current live UI does not expose Interested in option; continuing without synthetic interaction.`);
        runReport.record('INFO', testCaseId, 'Interested in control not exposed by current UI');
      }
    } catch (error) {
      logger.error(`${testCaseId} - Interested in action failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: selectSupplierPreference
   * Description: Selects a supplier preference and verifies the option is active where the UI exposes a native checked control.
   * Parameters: value - supplier preference, testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async selectSupplierPreference(value: string, testCaseId: string): Promise<void> {
    try {
      logger.info(`${testCaseId} - Start: supplier preference ${value}`);
      runReport.record('INFO', testCaseId, `Start: supplier preference ${value}`);
      const byLabel = this.page.getByLabel(value, { exact: true }).first();
      const labelInput = this.page.locator('label').filter({ hasText: value }).locator('input').first();
      if (await byLabel.count() > 0 && await byLabel.isVisible().catch(() => false)) {
        await byLabel.check();
        await expect(byLabel).toBeChecked();
      } else if (await labelInput.count() > 0) {
        await labelInput.check();
        await expect(labelInput).toBeChecked();
      } else {
        const text = this.page.getByText(value, { exact: true }).last();
        await text.click();
        await expect(text).toBeVisible();
      }
      runReport.record('PASS', testCaseId, `Supplier preference selected: ${value}`);
    } catch (error) {
      logger.error(`${testCaseId} - Supplier preference selection failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: selectStates
   * Description: Selects multiple states using a native multi-select when available and verifies each state text.
   * Parameters: values - state labels, testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async selectStates(values: string[], testCaseId: string): Promise<void> {
    try {
      logger.info(`${testCaseId} - Start: select multiple states`);
      runReport.record('INFO', testCaseId, 'Start: select multiple states');
      const selector = this.uiStore.STATE_SELECT_CSS;
      if (await selector.count() > 0) {
        const selected = await selector.evaluate((element, requestedStates) => {
          const select = element as HTMLSelectElement;
          const normalize = (value: string): string => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
          const requested = requestedStates as string[];
          const selectedOptions: string[] = [];

          for (const requestedState of requested) {
            const target = normalize(requestedState);
            const option = Array.from(select.options).find((item) => normalize(item.textContent ?? '') === target);
            if (!option) {
              throw new Error(`State option not found: ${requestedState}`);
            }
            option.selected = true;
            selectedOptions.push((option.textContent ?? '').trim());
          }

          select.dispatchEvent(new Event('input', { bubbles: true }));
          select.dispatchEvent(new Event('change', { bubbles: true }));
          return selectedOptions;
        }, values);

        for (const value of values) {
          const normalizedValue = value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
          expect(selected.some((item) => item.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '') === normalizedValue)).toBeTruthy();
        }
      } else {
        for (const value of values) {
          const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const option = this.page.locator('div:visible, li:visible, label:visible, span:visible').filter({ hasText: new RegExp(`^\\s*${escaped}\\s*$`, 'i') }).last();
          await expect(option).toBeVisible();
          await option.click();
        }
      }
      runReport.record('PASS', testCaseId, 'Multiple state selection verified');
    } catch (error) {
      logger.error(`${testCaseId} - Multiple state selection failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: fillMobile
   * Description: Fills Mobile Number and verifies the entered value.
   * Parameters: value - mobile number, testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async fillMobile(value: string, testCaseId: string): Promise<void> {
    try {
      await webDriverHelper.fillAndVerify(this.uiStore.MOBILE_CSS, value, testCaseId, 'Mobile Number');
    } catch (error) {
      logger.error(`${testCaseId} - Mobile fill failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: submit
   * Description: Clicks Submit Requirement and verifies that the browser remains responsive.
   * Parameters: testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async submit(testCaseId: string): Promise<void> {
    try {
      logger.info(`${testCaseId} - Start: Submit Requirement`);
      runReport.record('INFO', testCaseId, 'Start: Submit Requirement');
      await this.uiStore.SUBMIT_REQUIREMENT.click();
      await this.page.waitForTimeout(800);
      await expect(this.page.locator('body')).toBeVisible();
      runReport.record('PASS', testCaseId, 'Submit Requirement action completed');
    } catch (error) {
      logger.error(`${testCaseId} - Submit Requirement failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyOtpVisible
   * Description: Verifies that an OTP verification screen/input is displayed after a valid submission.
   * Parameters: testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async verifyOtpVisible(testCaseId: string): Promise<void> {
    try {
      const otpInput = this.page.locator('input[name*="otp" i], input[id*="otp" i], input[placeholder*="otp" i]').first();
      const otpText = this.uiStore.OTP_TEXT;
      await expect(otpInput.or(otpText)).toBeVisible();
      runReport.record('PASS', testCaseId, 'OTP verification screen verified');
    } catch (error) {
      logger.error(`${testCaseId} - OTP verification was not displayed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyNoOtpAndValidation
   * Description: Verifies that an invalid form submission does not open OTP and that validation evidence is present.
   * Parameters: testCaseId - test case identifier, fieldLocator - invalid field locator
   * Return Type: Promise<void>
   */
  public async verifyNoOtpAndValidation(testCaseId: string, fieldLocator: ReturnType<Page['locator']>): Promise<void> {
    try {
      const otpInput = this.page.locator('input[name*="otp" i], input[id*="otp" i], input[placeholder*="otp" i]').first();
      const otpVisible = await otpInput.isVisible().catch(() => false);
      expect(otpVisible).toBeFalsy();

      const nativeMessage = await webDriverHelper.getValidationMessage(fieldLocator);
      const invalid = await fieldLocator.evaluate((element) => {
        const input = element as HTMLInputElement;
        return !input.checkValidity() || input.getAttribute('aria-invalid') === 'true';
      }).catch(() => false);

      const textValidation = await this.uiStore.VALIDATION_MESSAGES.count().catch(() => 0);
      const bodyText = await this.page.locator('body').innerText();
      const hasFieldValidationKeyword = /required|invalid|valid mobile|must be greater|enter a valid/i.test(bodyText);

      expect(invalid || Boolean(nativeMessage) || textValidation > 0 || hasFieldValidationKeyword).toBeTruthy();

      runReport.record('PASS', testCaseId, 'Validation/no-OTP behavior verified');
    } catch (error) {
      logger.error(`${testCaseId} - Validation verification failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyMobileFormat
   * Description: Verifies that the mobile input contains the supplied value.
   * Parameters: expectedValue - expected mobile value, testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async verifyMobileFormat(expectedValue: string, testCaseId: string): Promise<void> {
    try {
      await webDriverHelper.verifyValue(this.uiStore.MOBILE_CSS, expectedValue, testCaseId, 'Mobile Number value');
    } catch (error) {
      logger.error(`${testCaseId} - Mobile value verification failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: isInterestedInAvailable
   * Description: Detects whether the current page exposes an Interested in control.
   * Parameters: None
   * Return Type: Promise<boolean>
   */
  public async isInterestedInAvailable(): Promise<boolean> {
    try {
      return (await this.uiStore.INTERESTED_IN_TEXT.count()) > 0 &&
        await this.uiStore.INTERESTED_IN_TEXT.isVisible().catch(() => false);
    } catch (error) {
      logger.error(`Interested in availability check failed: ${String(error)}`);
      throw error;
    }
  }
}
