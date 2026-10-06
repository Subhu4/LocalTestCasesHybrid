import { Page } from '@playwright/test';
import { logger } from './logger';
import { runReport } from './runReport';
import { screenshot } from './screenshot';

/**
 * Author: Subham Maharana
 * Method Name: executeTest
 * Description: Centralizes exception handling, reporting and screenshot capture for every test case.
 * Parameters: page - Playwright page, testCaseId - test case identifier, action - test body
 * Return Type: Promise<void>
 */
export async function executeTest(
  page: Page,
  testCaseId: string,
  action: () => Promise<void>
): Promise<void> {
  try {
    logger.info(`Starting test case: ${testCaseId}`);
    runReport.record('INFO', testCaseId, 'Test started');
    await action();
    runReport.record('PASS', testCaseId, 'Test completed');
    logger.info(`Completed test case: ${testCaseId}`);
  } catch (error) {
    logger.error(`Test case failed: ${testCaseId}: ${String(error)}`);
    runReport.record('FAIL', testCaseId, String(error));
    await screenshot.capture(page, testCaseId.toLowerCase());
    throw error;
  }
}
