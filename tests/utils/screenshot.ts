import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Author: Subham Maharana
 * Method Name: Screenshot
 * Description: Captures screenshots for failed test cases.
 * Parameters: None
 * Return Type: Screenshot instance
 */
export class Screenshot {
  /**
   * Author: Subham Maharana
   * Method Name: capture
   * Description: Saves a full-page screenshot using the test case identifier.
   * Parameters: page - Playwright page, testCaseId - test case identifier
   * Return Type: Promise<string>
   */
  public async capture(page: Page, testCaseId: string): Promise<string> {
    try {
      const directory = path.resolve('reports/screenshots');
      fs.mkdirSync(directory, { recursive: true });
      const file = path.join(
        directory,
        `${testCaseId}-${Date.now()}.png`
      );
      await page.screenshot({ path: file, fullPage: true });
      return file;
    } catch (error) {
      console.error(`Screenshot capture failed: ${String(error)}`);
      throw error;
    }
  }
}

export const screenshot = new Screenshot();
