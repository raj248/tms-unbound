import { PrismaClient, Role } from "@prisma/client"
import * as bcrypt from "bcryptjs"
import { prisma } from "../config/db"

// Configuration options for seed generation
const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product Management",
  "Quality Assurance",
  "Operations",
  "Human Resources",
]

const DEMO_USERS = [
  { username: "alice_dev", name: "Alice Johnston", role: Role.USER },
  { username: "bob_designer", name: "Bob Miller", role: Role.USER },
  { username: "charlie_pm", name: "Charlie Smith", role: Role.USER },
  { username: "dana_qa", name: "Dana Vance", role: Role.USER },
  { username: "admin_bell", name: "Bell Administrator", role: Role.ADMIN },
]

export async function seedDatabase() {
  console.log("🌱 Starting database seeding sequence...")

  try {
    // 1. Clean out existing records to avoid unique constraint duplicates on reruns
    console.log("🧹 Flushing existing User and Department records...")
    await prisma.user.deleteMany()
    await prisma.department.deleteMany()

    // 2. Seed Departments
    console.log(`🏢 Seeding ${DEPARTMENTS.length} departments...`)
    const seededDepartments = await Promise.all(
      DEPARTMENTS.map((name) =>
        prisma.department.create({
          data: { name },
        })
      )
    )
    console.log("✅ Departments seeded successfully.")

    // 3. Seed Users and Assign exactly 1 Random Department to each
    console.log(
      `👤 Seeding ${DEMO_USERS.length} users with assigned departments...`
    )

    // Hash a generic password for all seed accounts safely
    const defaultPasswordHash = await bcrypt.hash("password123", 10)

    const seededUsers = await Promise.all(
      DEMO_USERS.map((user) => {
        // Pick a completely random department from our fresh pool
        const randomDept =
          seededDepartments[
            Math.floor(Math.random() * seededDepartments.length)
          ]

        return prisma.user.create({
          data: {
            username: user.username,
            name: user.name,
            password: defaultPasswordHash,
            role: user.role,
            // Connect exactly one department to the implicit or explicit join table
            departments: {
              connect: { id: randomDept.id },
            },
          },
          include: {
            departments: true,
          },
        })
      })
    )

    console.log("✅ Users seeded and mapped to departments successfully.")

    // Log a sample mapping to verification console
    console.log("\n📋 Sample Seed Mapping Summary:")
    seededUsers.forEach((u) => {
      console.log(
        `   - User: ${u.username} [${u.role}] ➡️ Dept: ${u.departments[0]?.name || "None"}`
      )
    })

    console.log("\n🚀 Database seeding completed beautifully!")
  } catch (error) {
    console.error("❌ Seeding failed with error:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Self-execute if run directly via ts-node / tsx
if (require.main === module) {
  seedDatabase()
}
