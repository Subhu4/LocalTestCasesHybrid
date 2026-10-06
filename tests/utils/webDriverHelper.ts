import { expect, Locator, Page } from '@playwright/test';
import { logger } from './logger';
import { runReport } from './runReport';
import { screenshot } from './screenshot';

/**
 * Author: Subham Maharana
 * Method Name: WebDriverHelper
 * Description: Provides reusable browser actions with logging, verification and exception handling.
 * Parameters: None
 * Return Type: WebDriverHelper instance
 */
export class WebDriverHelper {
  /**
   * Author: Subham Maharana
   * Method Name: clickAndVerify
   * Description: Clicks a locator and verifies a supplied post-action condition.
   * Parameters: locator - target locator, testCaseId - test case identifier, actionName - action description, verification - post-action verification
   * Return Type: Promise<void>
   */
  public async clickAndVerify(
    locator: Locator,
    testCaseId: string,
    actionName: string,
    verification: () => Promise<void>
  ): Promise<void> {
    try {
      logger.info(`${testCaseId} - Start: ${actionName}`);
      runReport.record('INFO', testCaseId, `Start: ${actionName}`);
      await expect(locator).toBeVisible();
      await locator.click();
      await verification();
      logger.info(`${testCaseId} - Complete: ${actionName}`);
      runReport.record('PASS', testCaseId, `Complete: ${actionName}`);
    } catch (error) {
      logger.error(`${testCaseId} - Failed: ${actionName}: ${String(error)}`);
      runReport.record('FAIL', testCaseId, `${actionName}: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: fillAndVerify
   * Description: Fills a locator and verifies the entered value.
   * Parameters: locator - target locator, value - input value, testCaseId - test case identifier, actionName - action description
   * Return Type: Promise<void>
   */
  public async fillAndVerify(
    locator: Locator,
    value: string,
    testCaseId: string,
    actionName: string
  ): Promise<void> {
    try {
      logger.info(`${testCaseId} - Start: ${actionName}`);
      runReport.record('INFO', testCaseId, `Start: ${actionName}`);
      await expect(locator).toBeVisible();
      await locator.fill(value);
      await expect(locator).toHaveValue(value);
      logger.info(`${testCaseId} - Complete: ${actionName}`);
      runReport.record('PASS', testCaseId, `Complete: ${actionName}`);
    } catch (error) {
      logger.error(`${testCaseId} - Failed: ${actionName}: ${String(error)}`);
      runReport.record('FAIL', testCaseId, `${actionName}: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyVisible
   * Description: Verifies that a locator is visible and records the result.
   * Parameters: locator - target locator, testCaseId - test case identifier, actionName - verification description
   * Return Type: Promise<void>
   */
  public async verifyVisible(
    locator: Locator,
    testCaseId: string,
    actionName: string
  ): Promise<void> {
    try {
      logger.info(`${testCaseId} - Verify: ${actionName}`);
      runReport.record('INFO', testCaseId, `Verify: ${actionName}`);
      await expect(locator).toBeVisible();
      runReport.record('PASS', testCaseId, `Verified: ${actionName}`);
    } catch (error) {
      logger.error(`${testCaseId} - Verification failed: ${actionName}: ${String(error)}`);
      runReport.record('FAIL', testCaseId, `${actionName}: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyValue
   * Description: Verifies the current value of an input.
   * Parameters: locator - target input, expectedValue - expected value, testCaseId - test case identifier, actionName - verification description
   * Return Type: Promise<void>
   */
  public async verifyValue(
    locator: Locator,
    expectedValue: string,
    testCaseId: string,
    actionName: string
  ): Promise<void> {
    try {
      logger.info(`${testCaseId} - Verify value: ${actionName}`);
      runReport.record('INFO', testCaseId, `Verify value: ${actionName}`);
      await expect(locator).toHaveValue(expectedValue);
      runReport.record('PASS', testCaseId, `Verified value: ${actionName}`);
    } catch (error) {
      logger.error(`${testCaseId} - Value verification failed: ${actionName}: ${String(error)}`);
      runReport.record('FAIL', testCaseId, `${actionName}: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyUrl
   * Description: Verifies that the current URL contains an expected path or query string.
   * Parameters: page - Playwright page, expectedPart - expected URL fragment, testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async verifyUrl(
    page: Page,
    expectedPart: string,
    testCaseId: string
  ): Promise<void> {
    try {
      logger.info(`${testCaseId} - Verify URL contains: ${expectedPart}`);
      runReport.record('INFO', testCaseId, `Verify URL contains: ${expectedPart}`);
      await expect(page).toHaveURL(new RegExp(this.escapeRegExp(expectedPart)));
      runReport.record('PASS', testCaseId, `URL verified: ${expectedPart}`);
    } catch (error) {
      logger.error(`${testCaseId} - URL verification failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, `URL verification failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: escapeRegExp
   * Description: Escapes a string for safe use in a regular expression.
   * Parameters: value - raw string
   * Return Type: string
   */
  private escapeRegExp(value: string): string {
    try {
      return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    } catch (error) {
      console.error(`Regex escaping failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: getValidationMessage
   * Description: Reads native HTML validation text from an input or returns an empty string.
   * Parameters: locator - input locator
   * Return Type: Promise<string>
   */
  public async getValidationMessage(locator: Locator): Promise<string> {
    try {
      return await locator.evaluate((element) => {
        const input = element as HTMLInputElement;
        return input.validationMessage ?? '';
      });
    } catch (error) {
      logger.error(`Validation message read failed: ${String(error)}`);
      throw error;
    }
  }
}

export const webDriverHelper = new WebDriverHelper();
