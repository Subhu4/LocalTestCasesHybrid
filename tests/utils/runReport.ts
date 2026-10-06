import fs from 'fs';
import path from 'path';

export type ReportStatus = 'INFO' | 'PASS' | 'FAIL';

export interface ReportEntry {
  timestamp: string;
  status: ReportStatus;
  testCaseId: string;
  message: string;
}

/**
 * Author: Subham Maharana
 * Method Name: RunReport
 * Description: Maintains a timestamped JSON execution report.
 * Parameters: None
 * Return Type: RunReport instance
 */
export class RunReport {
  private readonly reportFile: string;
  private entries: ReportEntry[] = [];

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes the JSON report output file.
   * Parameters: None
   * Return Type: void
   */
  constructor() {
    try {
      const directory = path.resolve('reports/run-report');
      fs.mkdirSync(directory, { recursive: true });
      this.reportFile = path.join(directory, 'latest-run-report.json');
      this.persist();
    } catch (error) {
      console.error(`Run report initialization failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: record
   * Description: Adds an execution record and persists the report.
   * Parameters: status - report status, testCaseId - test case identifier, message - report message
   * Return Type: void
   */
  public record(status: ReportStatus, testCaseId: string, message: string): void {
    try {
      this.entries.push({
        timestamp: new Date().toISOString(),
        status,
        testCaseId,
        message
      });
      this.persist();
    } catch (error) {
      console.error(`Run report recording failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: persist
   * Description: Writes the current report collection to JSON.
   * Parameters: None
   * Return Type: void
   */
  private persist(): void {
    try {
      fs.writeFileSync(
        this.reportFile,
        JSON.stringify(this.entries, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error(`Run report persistence failed: ${String(error)}`);
      throw error;
    }
  }
}

export const runReport = new RunReport();
