const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

export default async function handler(req, res) {

    const { landId } = req.body
    
    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM land_sale WHERE land_id = ${parseInt(landId)}`)
    
    if(checkQuery.length>0) {
        res.json({
            address: checkQuery[0].address,
            price: checkQuery[0].price,
            status: true
        })
    }
    else {
        res.json({
            status: false
        })
    }

}