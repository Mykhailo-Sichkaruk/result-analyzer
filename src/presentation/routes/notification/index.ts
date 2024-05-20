import { FastifyRequest, FastifyReply } from "fastify";
import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

interface NotificationRequest {
  Body: {
    message: string;
    timestamp: string;
  };
}

export const handleNotification = async (
  request: FastifyRequest<NotificationRequest>,
  reply: FastifyReply,
) => {
  const { message, timestamp } = request.body;
  // Process the notification (e.g., save it to the database, send an alert, etc.)
  console.log(`Received notification: ${message} at ${timestamp}`);
  return reply.code(200).send({ success: true });
};

const wordListRoute: FastifyPluginAsync = async (fastify) => {
  const fastifyT = fastify.withTypeProvider<TypeBoxTypeProvider>();
  await fastifyT.register(async (fastifyScope) => {
    const fastifyT = fastifyScope.withTypeProvider<TypeBoxTypeProvider>();
    fastifyT.get("/", {
      handler: handleNotification,
    });
  });
};

export default wordListRoute;
