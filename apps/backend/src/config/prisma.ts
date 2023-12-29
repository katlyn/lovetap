import { PrismaClient } from "database"

import env from "./env.js"

const prisma: PrismaClient = new PrismaClient({
  datasourceUrl: env.database.url
})

export default prisma
