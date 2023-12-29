import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"
import httpErrors from "http-errors"

import prisma from "../config/prisma.js";

const healthcheck: FastifyPluginAsyncTypebox = async function (fastify): Promise<void> {
  fastify.get("/", {}, async () => {
    // Check connection to database
    try {
      await prisma.$queryRaw`SELECT 1`
      return { health: "ok" }
    } catch (err) {
      throw new httpErrors.InternalServerError("unhealthy")
    }
  })
}

export default healthcheck
