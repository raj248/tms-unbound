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
  "Update Landing Page",
  "Fix Login Bug",
  "Draft Q3 Report",
  "Audit Security Logs",
  "Interview Candidates",
  "Review Monthly Metrics",
  "Deploy New Release",
  "Setup CI/CD",
  "Design New Logo",
  "User Testing",
  "Create Social Media Campaign",
  "Update Policy Manual",
]

const TASK_STATUSES = [
  TaskStatus.IN_PROGRESS,
  TaskStatus.HOLD,
  TaskStatus.COMPLETED,
]

function getRandomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

export async function seedDatabase() {
  console.log("🌱 Starting database seeding sequence...")

  try {
    // 1. Clean out existing records to avoid unique constraint duplicates on reruns
    console.log("🧹 Flushing existing historical tables...")
    await prisma.notificationStatus.deleteMany()
    await prisma.notification.deleteMany()
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
    const defaultPasswordHash = await bcrypt.hash("password123", 10)

    const seededUsers = await Promise.all(
      DEMO_USERS.map((user) => {
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

    // 4. Seed Tasks, Remarks, and corresponding Notifications
    console.log(
      `📝 Seeding 150 tasks along with activity notification histories...`
    )
    const currentYear = new Date().getFullYear()
    const startDate = new Date(currentYear, 0, 1)
    const endDate = new Date(currentYear, 11, 31)

    for (let i = 0; i < 150; i++) {
      const randomDept =
        seededDepartments[Math.floor(Math.random() * seededDepartments.length)]
      const randomUser =
        Math.random() > 0.2
          ? seededUsers[Math.floor(Math.random() * seededUsers.length)]
          : null
      const randomStatus =
        TASK_STATUSES[Math.floor(Math.random() * TASK_STATUSES.length)]
      const randomName =
        TASK_NAMES[Math.floor(Math.random() * TASK_NAMES.length)] + ` #${i + 1}`
      const createdDate = getRandomDate(startDate, endDate)

      // A. Create Task
      const task = await prisma.task.create({
        data: {
          name: randomName,
          description: `This is auto-generated description for ${randomName}. Needs to be processed.`,
          status: randomStatus,
          departmentId: randomDept.id,
          assigneeId: randomUser ? randomUser.id : null,
          assigneeName: randomUser ? randomUser.name : null,
          createdAt: createdDate,
          updatedAt: createdDate,
          deadline:
            Math.random() > 0.5 ? getRandomDate(createdDate, endDate) : null,
        },
      })

      // B. Create matching Notification log for the newly created Task
      const taskNotification = await prisma.notification.create({
        data: {
          title: "🆕 New Task Assigned to Your Department",
          body: `"${task.name}" has been created. Status: ${task.status}.`,
          senderId: null, // System generated
          senderName: "System Engine",
          targetDeptId: randomDept.id,
          isAdminOnly: false,
          createdAt: createdDate,
        },
      })

      // Deliver this task notification to everyone in that department + all Admins
      const taskRecipients = seededUsers.filter(
        (u) =>
          u.role === "ADMIN" ||
          u.departments.some((d) => d.id === randomDept.id)
      )

      await prisma.notificationStatus.createMany({
        data: taskRecipients.map((recipient) => ({
          notificationId: taskNotification.id,
          userId: recipient.id,
          // Randomly mark older notifications as read so your pagination history has realistic UI variety
          isRead:
            createdDate.getTime() < Date.now() - 7 * 86400000
              ? Math.random() > 0.2
              : false,
          readAt:
            createdDate.getTime() < Date.now() - 7 * 86400000
              ? new Date(createdDate.getTime() + 3600000)
              : null,
        })),
      })

      // C. Add a Remark randomly (50% chance)
      if (Math.random() > 0.5) {
        const remarkAuthor =
          seededUsers[Math.floor(Math.random() * seededUsers.length)]
        const remarkDate = new Date(createdDate.getTime() + 86400000) // 1 day later

        await prisma.remark.create({
          data: {
            text: "Looking into this. Will update shortly.",
            taskId: task.id,
            authorName: remarkAuthor.name || remarkAuthor.username,
            createdAt: remarkDate,
          },
        })

        // Create matching Notification log for the Remark
        const remarkNotification = await prisma.notification.create({
          data: {
            title: `New Comment on "${task.name}"`,
            body: `${remarkAuthor.name || remarkAuthor.username}: "Looking into this. Will update shortly."`,
            senderId: remarkAuthor.id,
            senderName: remarkAuthor.name || remarkAuthor.username,
            targetDeptId: randomDept.id,
            isAdminOnly: false,
            createdAt: remarkDate,
          },
        })

        // Deliver the remark notification to the same audience
        await prisma.notificationStatus.createMany({
          data: taskRecipients.map((recipient) => ({
            notificationId: remarkNotification.id,
            userId: recipient.id,
            isRead:
              remarkDate.getTime() < Date.now() - 7 * 86400000
                ? Math.random() > 0.2
                : false,
            readAt:
              remarkDate.getTime() < Date.now() - 7 * 86400000
                ? new Date(remarkDate.getTime() + 1800000)
                : null,
          })),
        })
      }
    }

    console.log("✅ Tasks, remarks, and notifications seeded successfully.")

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

if (require.main === module) {
  seedDatabase()
}
