import { FastifyRequest, FastifyReply } from "fastify";
import { connectToDatabase } from "#infrastructure/db.js";
import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { ObjectId } from "mongodb";

interface GetTestResultsRequest {
  Querystring: {
    start: string;
    end: string;
  };
}

interface GetSpecificTestResultRequest {
  Params: {
    id: string;
  };
}

export const getAllTestResults = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const db = await connectToDatabase();
  const collection = db.collection("testResults");
  const results = await collection.find({}).toArray();
  return reply.code(200).send(results);
};

export const getTestResultsInRange = async (
  request: FastifyRequest<GetTestResultsRequest>,
  reply: FastifyReply,
) => {
  const { start, end } = request.query;
  const db = await connectToDatabase();
  const collection = db.collection("testResults");
  const results = await collection
    .find({ timestamp: { $gte: new Date(start), $lte: new Date(end) } })
    .toArray();
  return reply.code(200).send(results);
};

export const getSpecificTestResult = async (
  request: FastifyRequest<GetSpecificTestResultRequest>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const db = await connectToDatabase();
  const collection = db.collection("testResults");
  const objectId = new ObjectId(id);
  const result = await collection.findOne({ _id: objectId });
  if (result) {
    return reply.code(200).send(result);
  } else {
    return reply.code(404).send({ error: "Test result not found" });
  }
};

const wordListRoute: FastifyPluginAsync = async (fastify) => {
  const fastifyT = fastify.withTypeProvider<TypeBoxTypeProvider>();
  await fastifyT.register(async (fastifyScope) => {
    const fastifyT = fastifyScope.withTypeProvider<TypeBoxTypeProvider>();
    fastifyT.get("/", {
      handler: getAllTestResults,
    });
    fastifyT.get("/range", {
      handler: getTestResultsInRange,
    });
    fastifyT.get("/:id", {
      handler: getSpecificTestResult,
    });
  });
};

export default wordListRoute;
