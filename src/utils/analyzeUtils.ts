import { TestResult, TestReport } from "#domain/test/index.js";
import { log } from "#infrastructure/log.js";

export const analyzeResult = (testResult: TestResult) => {
  log.info("Analyzing test result", { testResult });
  return testResult;
};

export const generateReport = (testResult: TestResult): TestReport => {
  const summary = {
    totalTests: testResult.testItems.length,
    passedTests: testResult.testItems.filter((item) => item.status === "pass")
      .length,
    failedTests: testResult.testItems.filter((item) => item.status === "fail")
      .length,
    successRate: 0,
  };

  summary.successRate = summary.passedTests / summary.totalTests;

  const report: TestReport = {
    id: testResult.id,
    testResultId: testResult.id,
    summary,
    createdAt: new Date().toISOString(),
  };

  log.info("Generated report", { report });

  return report;
};
