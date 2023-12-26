import {FastifyPluginAsyncTypebox} from "@fastify/type-provider-typebox";

import healthcheck from "./healthcheck.js"
import receivers from "./receivers/index.js";

const routes: FastifyPluginAsyncTypebox = async function (fastify): Promise<void> {
  // Register healthcheck route
  await fastify.register(healthcheck, { prefix: "/healthcheck" })

  await fastify.register(receivers, { prefix: "/receivers"})
}

export default routes
