
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const companies = await prisma.company.findMany()
    console.log('Registered Companies:')
    companies.forEach(c => console.log(`- ${c.name} (${c.email})`))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
