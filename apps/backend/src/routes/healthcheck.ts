import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"
import { InternalServerError } from "http-errors"

import prisma from "../config/prisma.js";

const healthcheck: FastifyPluginAsyncTypebox = async function (fastify): Promise<void> {
  fastify.get("/", {}, async request => {
    // Check connection to database
    try {
      await prisma.$queryRaw`SELECT 1`
      return { health: "ok" }
    } catch (err) {
      throw new InternalServerError("unhealthy")
    }
  })
}

export default healthcheck
