const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

export default async function handler(req, res) {

    const { landId, address, cnic, status } = req.body

    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM land_sale WHERE address = ${address.toLowerCase()} AND land_id = ${landId}`)

    if(checkQuery.length>0 && checkQuery[0].status == "On Sale" ) {
        res.json({
            message: "Land is already put on sale"
        })
    }
    else {
        const insertQuery = await prisma.users.create({
            data: {
              land_id: landId,
              address: address,
              usercnic: cnic,
              status: "On Sale",
            },
        })

        res.json({
            message: "Land put on sale",
            status: insertQuery.status
        })
    }
}