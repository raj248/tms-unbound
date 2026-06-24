import 'dotenv/config'
import { prisma } from '../config/db.js'

async function main() {
  console.log('Migrating PENDING to IN_PROGRESS...')
  const updatedPending = await prisma.task.updateMany({
    where: { status: 'PENDING' as any },
    data: { status: 'IN_PROGRESS' as any },
  })
  console.log(`Updated ${updatedPending.count} PENDING tasks.`)

  console.log('Migrating BLOCKED to HOLD...')
  const updatedBlocked = await prisma.task.updateMany({
    where: { status: 'BLOCKED' as any },
    data: { status: 'HOLD' as any },
  })
  console.log(`Updated ${updatedBlocked.count} BLOCKED tasks.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
