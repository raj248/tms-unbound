import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"

// const prisma = new PrismaClient();
import { prisma } from "../config/db"

async function main() {
  console.log("🌱 Starting database seeding pool...")

  // Clean out any old conflicting records before seeding fresh ones
  // Cascade rules in your schema will automatically clean up trailing dependencies
  await prisma.user.deleteMany({})
  console.log("🧹 Cleaned up existing user records.")

  // Hash a uniform password for all dev accounts
  const commonPasswordHash = await bcrypt.hash("password123", 10)

  // 1. Create Admin Account
  const admin = await prisma.user.create({
    data: {
      username: "admin@test.com",
      name: "System Admin",
      password: commonPasswordHash,
      role: Role.ADMIN,
    },
  })
  console.log(`✅ Seeded ADMIN User: ${admin.username}`)

  // 2. Create Standard User Account 1
  const user1 = await prisma.user.create({
    data: {
      username: "user1@test.com",
      name: "John Doe",
      password: commonPasswordHash,
      role: Role.USER,
    },
  })
  console.log(`✅ Seeded STANDARD User 1: ${user1.username}`)

  // 3. Create Standard User Account 2
  const user2 = await prisma.user.create({
    data: {
      username: "user2@test.com",
      name: "Jane Smith",
      password: commonPasswordHash,
      role: Role.USER,
    },
  })
  console.log(`✅ Seeded STANDARD User 2: ${user2.username}`)

  console.log("🚀 Database seeding operations executed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding pipeline caught execution failure:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
