import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const prankPermission = await prisma.permission.upsert({
    where: { name: 'PrankPermission' },
    update: {},
    create: {
      name: 'PrankPermission',
    },
  })
  console.log({ prankPermission })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
