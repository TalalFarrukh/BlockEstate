const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

export default async function handler(req, res) {

    const getQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM land_sale `)

    if(getQuery.length>0) {
        res.json({
            landOnSale: getQuery,
            message: `${getQuery.length} land available for sale`
        })
    }
    else {
        res.json({
            message: "No land available on sale"
        })
    }

}