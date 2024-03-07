import { PrismaClient } from '@prisma/client'
import { PrismaSessionStore } from "@quixo3/prisma-session-store"

const prisma = new PrismaClient()

export { prisma }