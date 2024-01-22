import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"
import routeSchema from "api-types/routes"

import env from "../config/env.js";

const keys: FastifyPluginAsyncTypebox = async function (fastify): Promise<void> {
  fastify.get("/", { schema: routeSchema.keys.GET }, async () => {
    return { public: env.vapid.public }
  })
}

export default keys
