import { PrismaClient } from "database"
export type { Prisma } from "database"

import env from "./env.js"

const prisma: PrismaClient = new PrismaClient({
  datasourceUrl: env.database.path
})

export default prisma
