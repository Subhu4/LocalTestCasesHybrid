/**
 * Author: Subham Maharana
 * Method Name: Configuration constants
 * Description: Stores application paths and reusable framework configuration.
 * Parameters: None
 * Return Type: None
 */
export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://www.exportersindia.com',
  buyersPath: '/buyers/',
  requirementPath: '/post-buy-requirement.php',
  agriculturePath: '/buyers/agriculture.htm',
  textilesPath: '/buyers/textiles.htm',
  a4PaperPath: '/buyers/a4-size-copy-paper.htm',
  registrationPath: '/register-business-online?joinfree=buyleadstartsell',
  testDataPath: 'tests/test-data/testData.json'
};
