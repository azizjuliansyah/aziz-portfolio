// DB Config initialization
import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const connectionConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "portfolio_aziz",
  ssl: false,
  allowPublicKeyRetrieval: true,
  connectionLimit: 10,
  connectTimeout: 10000,
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (!globalForPrisma.prisma) {
  const adapter = new PrismaMariaDb(connectionConfig);
  prisma = new PrismaClient({ adapter: adapter as never });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} else {
  prisma = globalForPrisma.prisma;
}

export { prisma };
