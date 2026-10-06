const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash("Dung2005", 10)
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {
      password: hash
    },
    create: {
      username: "admin",
      password: hash,
    },
  })
  console.log("Admin seeded:", admin.username)
}
main()
