const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

export default async function handler(req, res) {

    const { landId, address } = req.body
    
    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM land_sale WHERE address = ${address.toLowerCase()} AND land_id = ${landId}`)
    
    if(checkQuery.length>0) {
        res.json({
            status: true
        })
    }
    else {
        res.json({
            status: false
        })
    }

}