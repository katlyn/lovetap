import buildServer from "./server.js"

import env from "./config/env.js"

const server = await buildServer({
  logger: { level: "info" },
  trustProxy: env.http.trustProxy
})

server.listen({
  host: env.http.host,
  port: env.http.port
}, (err, address) => {
  if (err !== null) {
    server.log.error(err)
    process.exit(1)
  }
  server.log.info(`Listening on ${address}`)
})
