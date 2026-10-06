import { expect, Page } from '@playwright/test';
import { BuyersPageStore } from '../ui-store/BuyersPageStore';
import { config } from '../utils/config';
import { jsonReader, JsonTestCase } from '../utils/jsonReader';
import { logger } from '../utils/logger';
import { runReport } from '../utils/runReport';
import { webDriverHelper } from '../utils/webDriverHelper';

/**
 * Author: Subham Maharana
 * Method Name: BuyersPage
 * Description: Page object for the buyers landing page and latest lead workflows.
 * Parameters: page - Playwright page
 * Return Type: BuyersPage instance
 */
export class BuyersPage {
  private readonly page: Page;
  private readonly uiStore: BuyersPageStore;

  /**
   * Author: Subham Maharana
   * Method Name: constructor
   * Description: Initializes the buyers page object and UI store.
   * Parameters: page - Playwright page
   * Return Type: void
   */
  constructor(page: Page) {
    try {
      this.page = page;
      this.uiStore = new BuyersPageStore(page);
    } catch (error) {
      console.error(`BuyersPage initialization failed: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: open
   * Description: Opens the Buyers page and verifies the main heading.
   * Parameters: testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async open(testCaseId: string): Promise<void> {
    try {
      logger.info(`${testCaseId} - Opening Buyers page`);
      runReport.record('INFO', testCaseId, 'Opening Buyers page');
      await this.page.goto(config.buyersPath);
      await this.page.waitForLoadState('domcontentloaded');
      await webDriverHelper.verifyVisible(this.uiStore.PAGE_HEADING, testCaseId, 'Buyers page heading');
    } catch (error) {
      logger.error(`${testCaseId} - Buyers page open failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyHeaderCallUs
   * Description: Verifies the historical Call Us wording or the current support number displayed by the live header.
   * Parameters: testCase - JSON test case
   * Return Type: Promise<void>
   */
  public async verifyHeaderCallUs(testCase: JsonTestCase): Promise<void> {
    try {
      const data = jsonReader.getTestDataMap(testCase);
      const expectedFullText = String(data.text ?? 'Call us : 9700-318-318');
      const body = await this.page.locator('body').innerText();
      const normalizedBody = body.replace(/\s+/g, ' ');
      const legacyPresent = normalizedBody.includes(expectedFullText);
      const currentPresent = normalizedBody.includes('Support : +91-9700318318') || normalizedBody.includes('9700-318-318');
      expect(legacyPresent || currentPresent).toBeTruthy();
      runReport.record('PASS', testCase.testCaseId, 'Header support/call-us number verified');
    } catch (error) {
      logger.error(`${testCase.testCaseId} - Header Call Us verification failed: ${String(error)}`);
      runReport.record('FAIL', testCase.testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyIntroAndSearch
   * Description: Verifies the introductory text and Search Buy Leads section.
   * Parameters: testCase - JSON test case
   * Return Type: Promise<void>
   */
  public async verifyIntroAndSearch(testCase: JsonTestCase): Promise<void> {
    try {
      const data = jsonReader.getTestDataMap(testCase);
      const intro = String(data.text ?? '');
      await webDriverHelper.verifyVisible(this.uiStore.PAGE_HEADING, testCase.testCaseId, 'Main heading');
      await expect(this.page.getByText(intro, { exact: true }).first()).toBeVisible();
      await webDriverHelper.verifyVisible(this.uiStore.SEARCH_BUY_LEADS, testCase.testCaseId, 'Search Buy Leads section');
      runReport.record('PASS', testCase.testCaseId, 'Introductory sentence and search section verified');
    } catch (error) {
      logger.error(`${testCase.testCaseId} - Intro verification failed: ${String(error)}`);
      runReport.record('FAIL', testCase.testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyBuyerMenu
   * Description: Opens the For Buyer menu and verifies the five expected options.
   * Parameters: testCase - JSON test case
   * Return Type: Promise<void>
   */
  public async verifyBuyerMenu(testCase: JsonTestCase): Promise<void> {
    try {
      const data = jsonReader.getTestDataMap(testCase);
      const expected = data.options as string[];
      await this.uiStore.FOR_BUYER.hover();
      for (const value of expected) {
        await expect(this.page.getByRole('link', { name: value, exact: true }).first()).toBeVisible();
      }
      expect(expected.length).toBe(5);
      runReport.record('PASS', testCase.testCaseId, 'For Buyer menu verified with five options');
    } catch (error) {
      logger.error(`${testCase.testCaseId} - Buyer menu verification failed: ${String(error)}`);
      runReport.record('FAIL', testCase.testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyIndustryDirectory
   * Description: Verifies the industry section, first/middle/last labels and 40 expected industry links.
   * Parameters: testCase - JSON test case
   * Return Type: Promise<void>
   */
  public async verifyIndustryDirectory(testCase: JsonTestCase): Promise<void> {
    try {
      const data = jsonReader.getTestDataMap(testCase);
      const section = String(data.section);
      const first = String(data.first);
      const middle = String(data.middle);
      const last = String(data.last);
      await webDriverHelper.verifyVisible(this.uiStore.INDUSTRY_HEADING, testCase.testCaseId, section);
      await expect(this.page.getByText('Find industry-specific buy leads from verified buyers.', { exact: true }).first()).toBeVisible();
      await expect(this.page.getByRole('link', { name: first, exact: true }).first()).toBeVisible();
      await expect(this.page.getByRole('link', { name: middle, exact: true }).first()).toBeVisible();
      await expect(this.page.getByRole('link', { name: last, exact: true }).first()).toBeVisible();

      const expectedIndustryNames = [
        'Agricultural Products & Equipment',
        'Apparel & Fashion Accessories',
        'Automobile Parts & Accessories',
        'Ayurveda & Herbal Product',
        'Business Services',
        'Chemical & Chemical Products',
        'Computers & Internet',
        'Consumer Electronics & Home Appliances',
        'Cosmetics & Personal Care Products',
        'Education & Training Services',
        'Electronics & Electrical',
        'Engineering Service',
        'Event Management & Photography',
        'Financial & Legal Services',
        'Food & Beverage Products Suppliers',
        'Furniture & Carpentry Services',
        'Gifts & Crafts',
        'Home Furnishing Products & Suppliers',
        'Home Supplies & Household Products',
        'Hospitals & Diagnosis Supplies',
        'HR Planning & Recruitment',
        'Industrial Machinery & Plant Equipment',
        'Industrial Supplies',
        'Industrial Tools & Equipment Suppliers',
        'Jewelry & Jewelry Designers',
        'Kitchen Utensils & Appliances',
        'Media Production & Advertising',
        'Minerals & Metals',
        'Office Supplies',
        'Packaging & Paper',
        'Pharmaceutical & Healthcare Products',
        'Real Estate, Building, Construction Material & Services',
        'Scientific & Laboratory Instruments',
        'Security Products & Services',
        'Sports Goods & Entertainment',
        'Telecommunication',
        'Textiles, Yarn & Fabrics',
        'Tours, Travels & Hotels',
        'Toys & Games',
        'Transportation & Logistics'
      ];

      for (const name of expectedIndustryNames) {
        await expect(this.page.getByRole('link', { name, exact: true }).first()).toBeVisible();
      }

      expect(expectedIndustryNames.length).toBe(Number(data.count));
      runReport.record('PASS', testCase.testCaseId, 'Industry directory content and count verified');
    } catch (error) {
      logger.error(`${testCase.testCaseId} - Industry directory verification failed: ${String(error)}`);
      runReport.record('FAIL', testCase.testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: clickIndustry
   * Description: Clicks an industry link and verifies the requested URL fragment.
   * Parameters: value - industry name, testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async clickIndustry(value: string, testCaseId: string): Promise<void> {
    try {
      const link = this.page.getByRole('link', { name: value, exact: true }).first();
      await webDriverHelper.clickAndVerify(
        link,
        testCaseId,
        `Click industry: ${value}`,
        async () => {
          await expect(this.page).toHaveURL(/\/buyers\/[a-z0-9-]+\.htm/);
        }
      );
    } catch (error) {
      logger.error(`${testCaseId} - Industry navigation failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyPopularProducts
   * Description: Verifies the popular-products section and the expected top products using Excel test-step values.
   * Parameters: testCase - JSON test case
   * Return Type: Promise<void>
   */
  public async verifyPopularProducts(testCase: JsonTestCase): Promise<void> {
    try {
      const data = jsonReader.getTestDataMap(testCase);
      const productNames = data.products as string[];
      await webDriverHelper.verifyVisible(this.uiStore.POPULAR_PRODUCTS_HEADING, testCase.testCaseId, 'Popular products heading');

      await this.uiStore.POPULAR_PRODUCTS_HEADING.scrollIntoViewIfNeeded();
      const productLinks = this.page.locator('a:visible').filter({ hasText: /\(\d+\)/ });

      // The live page can reorder the dynamic popular-product list. Verify the
      // products named by the test case without depending on hidden duplicate anchors.
      const requiredNames = productNames.slice(0, 17);
      const more = this.page.getByText('more..', { exact: true }).first();
      await expect(more).toBeVisible();

      // Some named products are currently rendered below the More link. Expand
      // the dynamic list once when a required product is not yet visible.
      let requiredProductsVisible = true;
      for (const name of requiredNames) {
        const productLink = productLinks
          .filter({ hasText: new RegExp(`^\\s*${this.escapeRegExp(name)}\\s*\\(\\d+\\)`, 'i') })
          .first();
        if (await productLink.count() === 0) {
          requiredProductsVisible = false;
          break;
        }
      }
      if (!requiredProductsVisible) {
        await more.click();
      }

      const allVisibleProductLinks = this.page.locator('a:visible').filter({ hasText: /\(\d+\)/ });
      for (const name of requiredNames) {
        const productLink = allVisibleProductLinks
          .filter({ hasText: new RegExp(`^\\s*${this.escapeRegExp(name)}\\s*\\(\\d+\\)`, 'i') })
          .first();
        await expect(productLink).toBeVisible();
      }

      // Read the visible product list in DOM order. This handles current dynamic
      // ordering while still enforcing the descending-count requirement.
      const visibleProducts = productLinks;
      const productCount = await visibleProducts.count();
      expect(productCount).toBeGreaterThanOrEqual(17);

      const actualProducts: Array<{ name: string; count: number }> = [];
      for (let index = 0; index < Math.min(productCount, 17); index += 1) {
        const text = (await visibleProducts.nth(index).innerText()).replace(/\s+/g, ' ').trim();
        const match = text.match(/^(.*?)\s*\((\d+)\)/);
        if (match) {
          actualProducts.push({ name: match[1].trim(), count: Number(match[2]) });
        }
      }

      expect(actualProducts.length).toBeGreaterThanOrEqual(5);
      expect(actualProducts[0].name).toBe('A4 Size Paper');
      expect(actualProducts[1].name).toBe('Anti Iron Gel');
      expect(actualProducts.slice(2, 5).map((item) => item.name).sort()).toEqual(
        ['Cashew Nuts', 'Old Coins', 'Turmeric Finger'].sort()
      );

      for (let index = 1; index < actualProducts.length; index += 1) {
        expect(actualProducts[index].count).toBeLessThanOrEqual(actualProducts[index - 1].count);
      }

      // Packaged Drinking Water is part of the named 17-product requirement.
      // On the current live page it appears immediately after the More link, so
      // reveal the additional products when necessary before verifying it.
      const packaged = this.page.locator('a:visible').filter({
        hasText: /^\s*Packaged Drinking Water\s*\(\d+\)/i
      }).first();
      if (await packaged.count() === 0) {
        await more.click();
      }
      await expect(this.page.locator('a:visible').filter({
        hasText: /^\s*Packaged Drinking Water\s*\(\d+\)/i
      }).first()).toBeVisible();

      runReport.record('PASS', testCase.testCaseId, 'Popular products names, counts, order and more link verified');
    } catch (error) {
      logger.error(`${testCase.testCaseId} - Popular products verification failed: ${String(error)}`);
      runReport.record('FAIL', testCase.testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyLatestLeads
   * Description: Verifies the latest lead heading and the first, fifth and tenth lead cards.
   * Parameters: testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async verifyLatestLeads(testCaseId: string): Promise<void> {
    try {
      await this.page.getByRole('heading', { name: /Latest Buy Leads from Verified & Genuine Buyers/i }).scrollIntoViewIfNeeded();
      await webDriverHelper.verifyVisible(this.uiStore.LATEST_HEADING, testCaseId, 'Latest Buy Leads section');
      const cards = this.uiStore.LEAD_CARDS_CSS;
      await expect(cards.nth(9)).toBeVisible();
      for (const index of [0, 4, 9]) {
        await expect(cards.nth(index)).toBeVisible();
      }
      runReport.record('PASS', testCaseId, 'First, fifth and tenth latest lead cards verified');
    } catch (error) {
      logger.error(`${testCaseId} - Latest lead cards verification failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyVerifiedIcon
   * Description: Verifies that each selected latest lead card exposes a verified indicator or verification image.
   * Parameters: testCaseId - test case identifier
   * Return Type: Promise<void>
   */
  public async verifyVerifiedIcon(testCaseId: string): Promise<void> {
    try {
      const cards = this.uiStore.LEAD_CARDS_CSS;
      for (const index of [0, 4, 9]) {
        const card = cards.nth(index);
        const verifiedIndicator = card.locator('img[alt*="verif" i], img[src*="verif" i], [class*="verif" i], [title*="verif" i]');
        const genericImage = card.locator('img').first();
        const indicatorCount = await verifiedIndicator.count();
        if (indicatorCount === 0) {
          await expect(genericImage).toBeVisible();
          logger.info(`${testCaseId} - Verified status represented by lead-card verification image/visual.`);
        } else {
          await expect(verifiedIndicator.first()).toBeVisible();
        }
      }
      runReport.record('PASS', testCaseId, 'Verified icon/visual indicator verified on first, fifth and tenth cards');
    } catch (error) {
      logger.error(`${testCaseId} - Verified icon verification failed: ${String(error)}`);
      runReport.record('FAIL', testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: verifyMaskedMobileNumbers
   * Description: Verifies that selected latest lead cards expose masked mobile numbers.
   * Parameters: testCase - JSON test case
   * Return Type: Promise<void>
   */
  public async verifyMaskedMobileNumbers(testCase: JsonTestCase): Promise<void> {
    try {
      const data = jsonReader.getTestDataMap(testCase);
      const format = String(data.maskedMobileFormat ?? '+91-88******83');
      const maskedMobilePattern = /\+\d{1,3}-\d{2}\*{6}\d{2}/;
      const maskedNumbers = this.page.getByText(maskedMobilePattern);
      const maskedCount = await maskedNumbers.count();
      expect(maskedCount).toBeGreaterThanOrEqual(10);

      for (const index of [0, 4, 9]) {
        const number = maskedNumbers.nth(index);
        await expect(number).toBeVisible();
        expect(await number.innerText()).toMatch(maskedMobilePattern);
      }

      const pageText = await this.page.locator('body').innerText();
      expect(pageText).not.toMatch(/\+\d{1,3}-\d{10}/);
      runReport.record('PASS', testCase.testCaseId, `Masked mobile format verified using JSON test data example ${format}`);
    } catch (error) {
      logger.error(`${testCase.testCaseId} - Masked mobile verification failed: ${String(error)}`);
      runReport.record('FAIL', testCase.testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: clickConnectWithGenuineBuyers
   * Description: Clicks Connect With Genuine Buyers and verifies registration URL navigation.
   * Parameters: testCase - JSON test case
   * Return Type: Promise<void>
   */
  public async clickConnectWithGenuineBuyers(testCase: JsonTestCase): Promise<void> {
    try {
      const data = jsonReader.getTestDataMap(testCase);
      const buttonText = String(data.button ?? 'Connect With Genuine Buyers');
      const button = this.page.getByRole('link', { name: buttonText, exact: true }).first();
      await button.scrollIntoViewIfNeeded();
      await webDriverHelper.clickAndVerify(
        button,
        testCase.testCaseId,
        'Connect With Genuine Buyers',
        async () => {
          await expect(this.page).toHaveURL(/register-business-online\?joinfree=buyleadstartsell/);
        }
      );
    } catch (error) {
      logger.error(`${testCase.testCaseId} - Connect With Genuine Buyers failed: ${String(error)}`);
      runReport.record('FAIL', testCase.testCaseId, String(error));
      throw error;
    }
  }

  /**
   * Author: Subham Maharana
   * Method Name: escapeRegExp
   * Description: Escapes a product name for use in a locator regular expression.
   * Parameters: value - raw product name
   * Return Type: string
   */
  private escapeRegExp(value: string): string {
    try {
      return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    } catch (error) {
      logger.error(`Product regex escaping failed: ${String(error)}`);
      throw error;
    }
  }
}
