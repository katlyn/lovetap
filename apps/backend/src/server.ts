import fastify from "fastify"

import traps from "@dnlup/fastify-traps"

interface ServerOptions {}

export default async function buildServer (opts: ServerOptions = {}) {
  const server = fastify()

  await server.register(traps, { strict: false })

  return server
}
