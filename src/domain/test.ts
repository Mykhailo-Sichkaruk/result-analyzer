export type BasicTestResult = {
  test_id: string;
  result_type: "basic";
  status: "pass" | "fail";
  error_message?: string;
};

export type LighthouseTestResult = {
  test_id: string;
  result_type: "lighthouse";
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  pwa_score: number;
};

export type UnitTestResult = {
  test_id: string;
  result_type: "unit";
  total_tests: number;
  passed: number;
  failed: number;
  failed_tests: {
    name: string;
    error_message: string;
  }[];
};

export type IntegrationTestResult = {
  test_id: string;
  result_type: "integration";
  total_tests: number;
  passed: number;
  failed: number;
  failed_tests: {
    name: string;
    error_message: string;
  }[];
};

export type TestResult =
  | BasicTestResult
  | LighthouseTestResult
  | UnitTestResult
  | IntegrationTestResult;

export type TestReport = {
  report_id: string;
  tests_run: number;
  passed: number;
  failed: number;
  details: TestResult[];
};
