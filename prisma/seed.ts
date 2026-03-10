import "dotenv/config";
import { prisma } from "../config/db";
import * as bcrypt from "bcrypt";

async function main() {
  console.log("Start seeding...");

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@portfolio.com" },
    update: {},
    create: {
      email: "admin@portfolio.com",
      password: hashedPassword,
      name: "Admin",
    },
  });

  console.log("Created admin user:", admin);

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
