import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"
import routeSchema from "api-types/routes"
import ReceiverService from "./ReceiverService.js";
import prisma from "../../config/prisma.js";
import httpErrors from "http-errors";

const routes: FastifyPluginAsyncTypebox = async function (fastify): Promise<void> {
  fastify.post("/", { schema: routeSchema.receivers.POST }, async (request, reply) => {
    reply.status(201)
    return ReceiverService.createReceiver(request.body.name)
  })

  fastify.get("/:id", { schema: routeSchema.receivers[":id"].GET }, async request => {
    const receiver = await prisma.receiver.findUnique({ where: request.params });
    if (receiver === null) {
      throw new httpErrors.NotFound(`Receiver ${request.params.id} not found`)
    }
    return receiver
  })

  // TODO: Check authentication details for the below routes!!
  fastify.patch("/:id", { schema: routeSchema.receivers[":id"].PATCH }, async (request, reply) => {
    const receiver = await prisma.receiver.findUnique({ where: request.params })
    if (receiver === null) {
      throw new httpErrors.NotFound()
    }
    if (!ReceiverService.verifySecret(request.headers.authorization, receiver.secretSalt, receiver.editSecretHash)) {
      throw new httpErrors.Unauthorized()
    }
    return prisma.receiver.update({
      where: request.params,
      data: request.body
    })
  })

  fastify.delete("/:id", { schema: routeSchema.receivers[":id"].DELETE }, async (request, reply) => {
    const receiver = await prisma.receiver.findUnique({ where: request.params })
    if (receiver === null) {
      throw new httpErrors.NotFound()
    }
    if (!ReceiverService.verifySecret(request.headers.authorization, receiver.secretSalt, receiver.editSecretHash)) {
      throw new httpErrors.Unauthorized()
    }
    await prisma.receiver.delete({ where: request.params })
    reply.status(204)
    return null
  })

  fastify.post("/:id/subscriptions", { schema: routeSchema.receivers[":id"]["/subscriptions"].POST }, async (request, reply) => {
    const receiver = await prisma.receiver.findUnique({ where: request.params })
    if (receiver === null) {
      throw new httpErrors.NotFound()
    }
    if (!ReceiverService.verifySecret(request.headers.authorization, receiver.secretSalt, receiver.editSecretHash)) {
      throw new httpErrors.Unauthorized()
    }
    reply.status(204)
    await ReceiverService.addPushSubscription(request.params.id, request.body)
  })

  fastify.post("/:id/messages", { schema: routeSchema.receivers[":id"]["/messages"].POST }, async (request, reply) => {
    const receiver = await prisma.receiver.findUnique({ where: request.params })
    if (receiver === null) {
      throw new httpErrors.NotFound()
    }
    if (!ReceiverService.verifySecret(request.headers.authorization, receiver.secretSalt, receiver.pushSecretHash)) {
      throw new httpErrors.Unauthorized()
    }
    await ReceiverService.sendMessage(request.params.id, request.body.from, request.body.content)
    reply.status(204)
  })
}

export default routes
