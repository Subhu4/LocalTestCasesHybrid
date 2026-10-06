# ExportersIndia Playwright TypeScript Hybrid Framework

## Scope

This project automates the 20 supplied SUBHAM functional test cases `TS_0061` through `TS_0080` from `testData.json`.

## Structure

```text
ExportersIndia_Playwright_Hybrid_MS1_Subham/
├── playwright-report/
├── reports/
│   ├── html/
│   ├── logs/
│   ├── run-report/
│   └── screenshots/
├── test-results/
├── tests/
│   ├── pages/
│   ├── test-data/
│   ├── ui-store/
│   ├── utils/
│   ├── requirementTests.spec.ts
│   ├── buyersTests.spec.ts
│   └── registrationTests.spec.ts
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```

The folder organization follows the supplied reference project style. Existing ExportersIndia file names and test-case IDs are retained.

## Framework flow

```text
Test Spec
   -> Page Object
      -> UI Store
         -> Playwright locator
            -> ExportersIndia
               -> Verification
                  -> Logger / Report / Screenshot on failure
```

## Test data

The runtime source is `tests/test-data/testData.json`. It contains only the data required by automation, keyed directly by `TS_0061` through `TS_0080`.

## Best practices implemented

- camelCase methods and variables
- UPPERCASE locator constants
- PascalCase classes
- Page Object Model
- one UI Store per Page Object
- Playwright built-in locators and CSS locators
- external JSON test data (selected runtime format)
- reusable Logger, Screenshot, RunReport and WebDriverHelper utilities
- try/catch handling with logging and reporting
- screenshots on test failure
- verification after actions
- JSDoc for framework methods
- serial execution for the dependent workflow tests
- HTML, video and trace evidence on failure

## Setup

```powershell
npm install
npx playwright install chromium
npm run typecheck
```

## Run all 20 test cases

```powershell
npm test
```

## Run headed

```powershell
$env:HEADED='true'; npm test
```

## Run individual groups

```powershell
npm run test:requirements
npm run test:buyers
npm run test:registration
```

## HTML report

```powershell
npm run report
```

## Important live-UI note

The supplied test cases contain some historical wording that can differ from the current ExportersIndia UI (for example the older `Interested in` wording and historical Call Us text). The Page Objects use compatibility checks rather than inventing UI controls. No OTP is bypassed or guessed.

Live execution should be performed on the target machine after installing dependencies and Chromium. The project is configured to run the complete 20-test master suite in order.

### Test execution order
The master `tests/testSuite.spec.ts` imports the existing spec files in test-case order, so the Playwright UI/report displays TS_0061–TS_0069, then TS_0070–TS_0079, then TS_0080. The original spec file names are unchanged.
