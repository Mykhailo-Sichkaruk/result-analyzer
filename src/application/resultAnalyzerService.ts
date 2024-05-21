import { log } from "#infrastructure/log.js";
import { connectToDatabase } from "#infrastructure/db.js";
import { analyzeResult, generateReport } from "#utils/analyzeUtils.js";
import { consumeTestResults } from "./rabbitmqService.js";

export const startResultAnalyzerService = async () => {
  const db = await connectToDatabase();
  const testResultCollection = db.collection("testResults");
  const testReportCollection = db.collection("testReports");

  consumeTestResults(async (msg) => {
    log.info("Received test result", msg);
    await testResultCollection.insertOne(msg);
    const analysis = analyzeResult(msg);
    const report = generateReport(analysis);
    await testReportCollection.insertOne(report);
    log.info("Report generated and saved to the database with the results", report);
  });
};

export const getReports = async () => {
  const db = await connectToDatabase();
  const collection = db.collection("testReports");
  const result = collection.find({}).toArray();
  log.info("Get reports", result);
  return result;
};
