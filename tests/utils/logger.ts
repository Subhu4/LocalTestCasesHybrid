import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Author: Subham Maharana
 * Method Name: Logger
 * Description: Provides timestamp-based file logging for framework execution.
 * Parameters: None
 * Return Type: Logger instance
 */
export class Logger {
  private readonly logFile: string;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Creates the timestamped log file used by the framework.
   * Parameters: None
   * Return Type: void
   */
  constructor() {
    try {
      const directory = path.resolve('reports/logs');
      fs.mkdirSync(directory, { recursive: true });
      this.logFile = path.join(
        directory,
        `execution-${new Date().toISOString().replace(/[:.]/g, '-')}.log`
      );
    } catch (error) {
      console.error(`Logger initialization failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: info
   * Description: Writes an informational timestamped message.
   * Parameters: message - log message
   * Return Type: void
   */
  public info(message: string): void {
    try {
      this.write('INFO', message);
    } catch (error) {
      console.error(`Info logging failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: error
   * Description: Writes an error timestamped message.
   * Parameters: message - error message
   * Return Type: void
   */
  public error(message: string): void {
    try {
      this.write('ERROR', message);
    } catch (error) {
      console.error(`Error logging failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: write
   * Description: Writes a formatted message to the log file.
   * Parameters: level - log level, message - message text
   * Return Type: void
   */
  private write(level: string, message: string): void {
    try {
      const line = `[${new Date().toISOString()}] [${level}] ${message}${os.EOL}`;
      fs.appendFileSync(this.logFile, line, 'utf8');
    } catch (error) {
      console.error(`File logging failed: ${String(error)}`);
      throw error;
    }
  }
}

export const logger = new Logger();
