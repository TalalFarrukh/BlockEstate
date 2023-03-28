const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

export default async function handler(req, res) {

    const { landId, address } = req.body
    
    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * from bid_requests WHERE buyer_address = ${address.toLowerCase()} AND land_id = ${parseInt(landId)}`)

    if(checkQuery.length > 0) {
        res.json({
            bidPrice: checkQuery[0].bid_price,
            status: true
        })
    }
    else {
        res.json({
            status: false
        })
    }

}