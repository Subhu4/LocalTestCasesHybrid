import fs from 'fs';
import path from 'path';
import { config } from './config';

export interface JsonTestCase {
  testCaseId: string;
  TestData: Record<string, unknown>;
}

/**
 * Author: Subham Maharana
 * Method Name: JsonReader
 * Description: Reads direct test-case keyed JSON test data.
 * Parameters: None
 * Return Type: JsonReader instance
 */
export class JsonReader {
  private readonly testCases = new Map<string, JsonTestCase>();

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Loads the JSON test data into memory.
   * Parameters: None
   * Return Type: void
   */
  constructor() {
    try {
      this.loadJson();
    } catch (error) {
      console.error(`JSON reader initialization failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: loadJson
   * Description: Loads all direct test-case entries from testData.json.
   * Parameters: None
   * Return Type: void
   */
  private loadJson(): void {
    try {
      const filePath = path.resolve(config.testDataPath);
      if (!fs.existsSync(filePath)) {
        throw new Error(`JSON test data file not found: ${filePath}`);
      }

      const file = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, Record<string, unknown>>;

      for (const [testCaseId, testData] of Object.entries(file)) {
        this.testCases.set(testCaseId, { testCaseId, TestData: testData });
      }

      if (this.testCases.size !== 20) {
        throw new Error(`Expected 20 test cases from JSON but loaded ${this.testCases.size}.`);
      }
    } catch (error) {
      console.error(`JSON test data loading failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: getTestCase
   * Description: Returns one test case by ID.
   * Parameters: testCaseId - test case identifier
   * Return Type: JsonTestCase
   */
  public getTestCase(testCaseId: string): JsonTestCase {
    try {
      const testCase = this.testCases.get(testCaseId);
      if (!testCase) throw new Error(`Test case ${testCaseId} was not found in JSON.`);
      return testCase;
    } catch (error) {
      console.error(`JSON test case lookup failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: getTestDataMap
   * Description: Returns the test data object for a test case.
   * Parameters: testCase - JSON test case
   * Return Type: Record<string, unknown>
   */
  public getTestDataMap(testCase: JsonTestCase): Record<string, unknown> {
    try {
      return testCase.TestData;
    } catch (error) {
      console.error(`JSON test data lookup failed: ${String(error)}`);
      throw error;
    }
  }
}

export const jsonReader = new JsonReader();
