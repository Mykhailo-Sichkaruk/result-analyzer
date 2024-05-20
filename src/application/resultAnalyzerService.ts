import { connectToDatabase } from "#infrastructure/db.js";
import { Channel, ConsumeMessage } from "amqplib";
import { analyzeResult, generateReport } from "#utils/analyzeUtils.js";
import { connectRabbitMQ } from "./rabbitmqService.js";

const RESULT_QUEUE = "result_queue";

export const startResultAnalyzerService = async () => {
  const db = await connectToDatabase();
  const collection = db.collection("testResults");
  const channel: Channel = await connectRabbitMQ();

  channel.consume(RESULT_QUEUE, async (msg: ConsumeMessage | null) => {
    if (msg) {
      const testResult = JSON.parse(msg.content.toString());
      await collection.insertOne(testResult);
      await collection.insertOne(testResult);
      const reportCollection = db.collection("testReports");
      const analysis = analyzeResult(testResult);
      const report = generateReport(analysis);
      console.log("Report generated:", report);
      await reportCollection.insertOne(report);
      channel.ack(msg);
    }
  });

  console.log(`Listening for messages on ${RESULT_QUEUE}`);
};

export const getReports = async () => {
  const db = await connectToDatabase();
  const collection = db.collection("testReports");
  return collection.find({}).toArray();
};
