import { startResultAnalyzerService } from "#application/resultAnalyzerService.js";
import { startHttpServer } from "#presentation/server.js";
import { log } from "#infrastructure/log.js";
import { connectRabbitMQ, createQueues } from "#application/rabbitmqService.js";

const start = async () => {
  try {
    await createQueues(); // Ensure RabbitMQ queues are created
    await connectRabbitMQ(); // Ensure RabbitMQ is connected and queues are created
    await startHttpServer();
    await startResultAnalyzerService();
  } catch (err) {
    log.fatal(err);
    process.exit(1);
  }
};

await start();
