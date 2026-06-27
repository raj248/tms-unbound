// prisma/seed.ts
// Run with: npx ts-node prisma/seed.ts
// Or add to package.json: "prisma": { "seed": "ts-node prisma/seed.ts" }
// Then run: npx prisma db seed

import bcrypt from "bcryptjs"

import { prisma } from "../config/db"
import { TaskStatus } from "@prisma/client"
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse "May 2026 | Week 2" into a createdAt date.
 * Week 1 → 1st, Week 2 → 8th, Week 3 → 15th, Week 4 → 22nd of that month.
 */
function parseInsightDate(insight: string): Date {
  const match = insight.match(/(\w+)\s+(\d{4})\s*\|\s*Week\s*(\d)/)
  if (!match) return new Date()

  const [, monthStr, yearStr, weekStr] = match
  const month = new Date(`${monthStr} 1, ${yearStr}`).getMonth() // 0-indexed
  const year = parseInt(yearStr)
  const weekDay = (parseInt(weekStr) - 1) * 7 + 1 // Week 1→1, 2→8, 3→15, 4→22

  return new Date(year, month, weekDay)
}

/**
 * Extract a metric value from the first line of a description if it looks numeric.
 * e.g. "27,811" in S.No column, or "6,657.60" → 6657.60
 */
function parseMetric(raw: string | null): number | null {
  if (!raw) return null
  const cleaned = raw.replace(/,/g, "")
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const DEPARTMENTS = [
  "Accounts",
  "Ecommerce",
  "Editorial",
  "Online and Dispatch",
  "Sales Offline",
  "Social Media",
]

// Users that appear as assignees in the CSV + a default admin
const USERS = [
  {
    username: "admin",
    name: "Admin",
    password: "admin123",
    role: "ADMIN" as const,
  },
  {
    username: "puran",
    name: "Puran ji",
    password: "puran123",
    role: "USER" as const,
  },
  {
    username: "alind",
    name: "Alind",
    password: "alind123",
    role: "USER" as const,
  },
]

// Raw CSV rows — (sno used as metricValue when present, insight drives createdAt)
interface RawTask {
  metricRaw: string | null // from S.No column when it has a value like "27,811"
  name: string
  description: string | null
  category: string
  status: TaskStatus
  assignee: string | null
  remarks: string | null
  insight: string
}

const RAW_TASKS: RawTask[] = [
  {
    metricRaw: null,
    name: "Reconcile Accounts",
    description: "HDFC - 31th April\nRAW - 31sth March",
    category: "Accounts",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "Claim Return",
    description: "Total No. : 5\nAmount Reimbursed: 509.99",
    category: "Ecommerce",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "Upload Kindle and Google books",
    description: null,
    category: "Ecommerce",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "English Books",
    description: "Review and organize book editorial",
    category: "Editorial",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "Weekly Sales (RCT)",
    description: "Analyze marketplace sales",
    category: "Online and Dispatch",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "Call potential clients",
    description: "Sales outreach",
    category: "Sales Offline",
    status: "IN_PROGRESS",
    assignee: "Puran ji",
    remarks: null,
    insight: "May 2026 | Week 2",
  },
  {
    metricRaw: null,
    name: "Sales offline",
    description: null,
    category: "Sales Offline",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 3",
  },
  {
    metricRaw: null,
    name: "Sales offline",
    description: null,
    category: "Sales Offline",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 4",
  },
  {
    metricRaw: null,
    name: "Reconcile Accounts",
    description: "Monthly accounting audit",
    category: "Accounts",
    status: "IN_PROGRESS",
    assignee: "Alind",
    remarks: "aas",
    insight: "May 2026 | Week 2",
  },
  {
    metricRaw: null,
    name: "Draft Newsletter",
    description: "Monthly update for dispatch",
    category: "Online and Dispatch",
    status: "IN_PROGRESS",
    assignee: "Alind",
    remarks: "great work",
    insight: "May 2026 | Week 3",
  },
  {
    metricRaw: null,
    name: "PI / PC",
    description: null,
    category: "Accounts",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: "Check Week 4",
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "Expense & Revenue Report",
    description: "Check Week 4",
    category: "Accounts",
    status: "COMPLETED",
    assignee: null,
    remarks: "Check Week 4",
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: "27,811",
    name: "Seller Weekly Sales",
    description:
      "Amazon\nFlipkart\nMeesho\n27,811 Total, Individual data not given",
    category: "Ecommerce",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "New Release Information Add and Email Sent",
    description: "Check Week 4",
    category: "Ecommerce",
    status: "COMPLETED",
    assignee: null,
    remarks: "Check Week 4",
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: "6,657.60",
    name: "Website Sales",
    description: "No. of Orders 9, Amount: 6,657.60",
    category: "Ecommerce",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "New Sellers / Platform",
    description: null,
    category: "Ecommerce",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "Tender Participation & Result",
    description: null,
    category: "Online and Dispatch",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "Stock Sheet",
    description: null,
    category: "Online and Dispatch",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "Mapping Titles",
    description: null,
    category: "Online and Dispatch",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "Pending & Dispatched Orders",
    description: null,
    category: "Online and Dispatch",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "Payments / Puran Ji",
    description: null,
    category: "Sales Offline",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "Orders / Puran Ji",
    description: null,
    category: "Sales Offline",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
  {
    metricRaw: null,
    name: "Suspense A/c",
    description: null,
    category: "Accounts",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 2",
  },
  {
    metricRaw: null,
    name: "Followers / Subscribers Increase",
    description:
      "As of 11.05.2026\nInstagram- 26255\nFacebook- 9844\nTwitter (X) - 2496\nYoutube- 1729\nAs of 16.05.2026\nInstagram - 26255\nFacebook- 9858\nTwitter (X) - 2498\nYoutube - 1732",
    category: "Social Media",
    status: "IN_PROGRESS",
    assignee: null,
    remarks: null,
    insight: "May 2026 | Week 1",
  },
]

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function main() {
  console.log("🌱 Starting seed…")

  //  remove all tasks, remarks, notifications, notificationstatuses
  await prisma.task.deleteMany({})
  await prisma.remark.deleteMany({})
  await prisma.notificationStatus.deleteMany({})
  await prisma.notification.deleteMany({})

  // 1. Upsert departments
  console.log("  → Seeding departments…")
  const deptMap: Record<string, string> = {} // name → id

  for (const name of DEPARTMENTS) {
    const dept = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    deptMap[name] = dept.id
    console.log(`     ✔ Department: ${name}`)
  }

  // 2. Upsert users and connect to a default department
  console.log("  → Seeding users…")
  const userMap: Record<string, { id: string; name: string | null }> = {} // name (lowercase) → {id, name}

  for (const u of USERS) {
    const hashed = await bcrypt.hash(u.password, 10)

    // Connect admin to first dept, others to matching dept by rough name or first dept
    const defaultDeptId =
      u.username === "alind"
        ? deptMap["Accounts"]
        : u.username === "puran"
          ? deptMap["Sales Offline"]
          : deptMap["Accounts"]

    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        name: u.name,
        password: hashed,
        role: u.role,
        departments: { connect: { id: defaultDeptId } },
      },
    })

    if (u.name) userMap[u.name.toLowerCase()] = { id: user.id, name: user.name }
    console.log(`     ✔ User: ${u.name} (@${u.username})`)
  }

  // 3. Seed tasks + remarks
  console.log("  → Seeding tasks…")

  for (const row of RAW_TASKS) {
    const deptId = deptMap[row.category]
    if (!deptId) {
      console.warn(
        `     ⚠ Unknown department "${row.category}" — skipping task "${row.name}"`
      )
      continue
    }

    // Resolve assignee
    const assigneeKey = row.assignee?.toLowerCase()
    const assigneeRecord = assigneeKey ? userMap[assigneeKey] : null
    const metricValue = parseMetric(row.metricRaw)

    // Metric label: derive from task name for the two numeric tasks
    let metricLabel: string | null = null
    if (metricValue !== null) {
      if (row.name.includes("Seller Weekly Sales")) metricLabel = "Total Sales"
      else if (row.name.includes("Website Sales")) metricLabel = "Revenue (₹)"
    }

    const createdAt = parseInsightDate(row.insight)

    const task = await prisma.task.create({
      data: {
        name: row.name,
        description: row.description,
        status: row.status,
        metricValue,
        metricLabel,
        departmentId: deptId,
        assigneeId: assigneeRecord?.id ?? null,
        assigneeName: assigneeRecord?.name ?? row.assignee ?? null,
        createdAt,
        updatedAt: createdAt,
      },
    })

    // Seed remark if present
    if (row.remarks?.trim()) {
      await prisma.remark.create({
        data: {
          taskId: task.id,
          text: row.remarks.trim(),
          authorName: "Admin",
          createdAt,
        },
      })
    }

    console.log(`     ✔ Task: ${row.name} [${row.category}] — ${row.status}`)
  }

  console.log("\n✅ Seed complete.")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
