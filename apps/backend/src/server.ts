import fastify from "fastify"
import fastifyCors from "@fastify/cors"
import customTransformKeyword from "ajv-custom-transform"

import traps from "@dnlup/fastify-traps"
import env from "./config/env.js";
import routes from "./routes/index.js";

interface ServerOptions {}

export default async function buildServer (opts: ServerOptions = {}) {
  const server = fastify({
    ...opts,
    ajv: {
      customOptions: {
        removeAdditional: "all",
        keywords: [customTransformKeyword]
      }
    }
  })

  await server.register(traps, { strict: false })

  await server.register(fastifyCors, {
    origin: env.http.corsUrl,
    credentials: true
  })

  await server.register(routes)

  return server
}
