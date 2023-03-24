const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

export default async function handler(req, res) {

    const { address } = req.body

    const getQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM users WHERE address = ${address.toLowerCase()}`)

    res.json({
        address: getQuery[0].address,
        cnic: getQuery[0].cnic,
        firstName: getQuery[0].first_name,
        lastName: getQuery[0].last_name,
        email: getQuery[0].email,
        contact: getQuery[0].contact
    })

}