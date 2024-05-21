import { startResultAnalyzerService } from "#application/resultAnalyzerService.js";
import { createQueues } from "#application/rabbitmqService.js";
import { startHttpServer } from "#presentation/server.js";
import { log } from "#infrastructure/log.js";

const start = async () => {
  try {
    await createQueues(); // Ensure RabbitMQ queues are created
    await startHttpServer();
    log.info("Start repetative checking of result queue");
    setInterval(async () => {
        await startResultAnalyzerService();
    }, 10000);
  } catch (err) {
    log.fatal(err);
    process.exit(1);
  }
};

await start();
