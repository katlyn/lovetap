import fastify from "fastify"
import fastifyCors from "@fastify/cors"
import customTransformKeyword from "ajv-custom-transform"

import traps from "@dnlup/fastify-traps"
import env from "./config/env.js";
import routes from "./routes/index.js";
import fastifyStatic from "@fastify/static";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {readFileSync} from "fs";

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

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const frontendRoot = join(__dirname, "../../frontend/dist")
  await server.register(fastifyStatic, {
    root: frontendRoot
  })

  server.setNotFoundHandler(async (request, reply) => {
    return reply.sendFile("index.html")
  })

  await server.register(routes)

  return server
}
