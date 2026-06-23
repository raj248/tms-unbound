import { PrismaClient, Role, TaskStatus } from "@prisma/client"
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
  "Marketing",
  "Sales",
]

const DEMO_USERS = [
  { username: "alice_dev", name: "Alice Johnston", role: Role.USER },
  { username: "bob_designer", name: "Bob Miller", role: Role.USER },
  { username: "charlie_pm", name: "Charlie Smith", role: Role.USER },
  { username: "dana_qa", name: "Dana Vance", role: Role.USER },
  { username: "admin_bell", name: "Bell Administrator", role: Role.ADMIN },
  { username: "eve_ops", name: "Eve Operations", role: Role.USER },
  { username: "frank_hr", name: "Frank Human Resources", role: Role.USER },
]

const TASK_NAMES = [
  "Update Landing Page", "Fix Login Bug", "Draft Q3 Report", "Audit Security Logs", 
  "Interview Candidates", "Review Monthly Metrics", "Deploy New Release", "Setup CI/CD",
  "Design New Logo", "User Testing", "Create Social Media Campaign", "Update Policy Manual"
]

const TASK_STATUSES = [
  TaskStatus.PENDING,
  TaskStatus.IN_PROGRESS,
  TaskStatus.BLOCKED,
  TaskStatus.COMPLETED,
]

function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export async function seedDatabase() {
  console.log("🌱 Starting database seeding sequence...")

  try {
    // 1. Clean out existing records to avoid unique constraint duplicates on reruns
    console.log("🧹 Flushing existing Task, User, Department, and Remark records...")
    await prisma.remark.deleteMany()
    await prisma.task.deleteMany()
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

    // 4. Seed Tasks and Remarks across the year
    console.log(`📝 Seeding 150 tasks across various dates and departments...`)
    const currentYear = new Date().getFullYear()
    const startDate = new Date(currentYear, 0, 1) // Jan 1st of current year
    const endDate = new Date(currentYear, 11, 31) // Dec 31st of current year

    for (let i = 0; i < 150; i++) {
      const randomDept = seededDepartments[Math.floor(Math.random() * seededDepartments.length)]
      const randomUser = Math.random() > 0.2 ? seededUsers[Math.floor(Math.random() * seededUsers.length)] : null
      const randomStatus = TASK_STATUSES[Math.floor(Math.random() * TASK_STATUSES.length)]
      const randomName = TASK_NAMES[Math.floor(Math.random() * TASK_NAMES.length)] + ` #${i+1}`
      const createdDate = getRandomDate(startDate, endDate)
      
      const task = await prisma.task.create({
        data: {
          name: randomName,
          description: `This is auto-generated description for ${randomName}. Needs to be processed.`,
          status: randomStatus,
          departmentId: randomDept.id,
          assigneeId: randomUser ? randomUser.id : null,
          assigneeName: randomUser ? randomUser.name : null,
          createdAt: createdDate,
          updatedAt: createdDate, // Simplify by making them the same
          deadline: Math.random() > 0.5 ? getRandomDate(createdDate, endDate) : null
        }
      })

      // Add a couple of remarks randomly
      if (Math.random() > 0.5) {
        const remarkAuthor = seededUsers[Math.floor(Math.random() * seededUsers.length)]
        await prisma.remark.create({
          data: {
            text: "Looking into this. Will update shortly.",
            taskId: task.id,
            authorName: remarkAuthor.name || remarkAuthor.username,
            createdAt: new Date(createdDate.getTime() + 86400000) // 1 day later
          }
        })
      }
    }
    console.log("✅ Tasks and remarks seeded successfully.")

    // Log a sample mapping to verification console
    console.log("\n📋 Sample Seed Mapping Summary:")
    seededUsers.slice(0, 3).forEach((u) => {
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
