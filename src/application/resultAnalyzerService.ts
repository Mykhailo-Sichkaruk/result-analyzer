import { log } from "#infrastructure/log.js";
import { connectToDatabase } from "#infrastructure/db.js";
import { analyzeResult, generateReport } from "#utils/analyzeUtils.js";
import { consumeTestResults } from "./rabbitmqService.js";

export const startResultAnalyzerService = async () => {
  const db = await connectToDatabase();
  const testResultCollection = db.collection("testResults");
  const testReportCollection = db.collection("testReports");

  consumeTestResults(async (msg) => {
    await testResultCollection.insertOne(msg);
    const analysis = analyzeResult(msg);
    const report = generateReport(analysis);
    log.info("Report generated:", report);
    await testReportCollection.insertOne(report);
  });
};

export const getReports = async () => {
  const db = await connectToDatabase();
  const collection = db.collection("testReports");
  return collection.find({}).toArray();
};
