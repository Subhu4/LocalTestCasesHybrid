# JSON Test Data

`testData.json` is the runtime source for the 20 ExportersIndia test cases `TS_0061` through `TS_0080`.

The file intentionally contains only the data required by automation. Each test case is a direct JSON key, with no worksheet wrapper, test steps, descriptions, expected results, or reporting fields.

Example:

```json
{
  "TS_0062": {
    "product": "Office Chairs",
    "interestedIn": "Computer Chairs",
    "quantity": "25",
    "unit": "Piece",
    "supplierPreference": "All India",
    "mobileNumber": "9861320992"
  }
}
```
