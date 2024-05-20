import { MongoClient } from "mongodb";
import env from "#config/env.js";
import { log } from "./log.js";

let client: MongoClient;

export const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(env.MONGODB_URL, {
      // tls: true,
      tlsAllowInvalidCertificates: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });

    try {
      await client.connect();
      log.info("Connected to MongoDB");
    } catch (error) {
      log.error("Could not connect to MongoDB", error);
      process.exit(1);
    }
  }
  return client.db();
};
