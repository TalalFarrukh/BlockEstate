const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

export default async function handler(req, res) {

    const { landId, address, cnic, status, landAddress, type, area, price } = req.body

    if(status === "On Sale") {

        const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM land_sale WHERE address = ${address.toLowerCase()} AND land_id = ${landId}`)

        if(checkQuery.length>0) {
            res.json({
                message: "Land is already put on sale"
            })
        }
        else {
            // const insertQuery = await prisma.land_sale.create({
            //     data: {
            //       land_id: landId,
            //       address: address,
            //       usercnic: cnic,
            //       status: status,
            //     },
            // })

            const insertQuery = await prisma.$executeRaw`INSERT INTO land_sale (land_id, address, usercnic, price, land_address, type, area) 
            VALUES (${landId}, ${address.toLowerCase()}, ${cnic}, ${parseInt(price)}, ${landAddress}, ${type}, ${area})`

            res.json({
                message: "Land put on sale",
                status: insertQuery.status
            })
        }

    }
    else if(status === "Off Sale") {
        
        const deleteQuery = await prisma.$executeRaw`DELETE FROM land_sale WHERE address = ${address.toLowerCase()} AND land_id = ${landId}`

        const deleteBidRequestQuery = await prisma.$executeRaw`DELETE FROM bid_requests WHERE seller_address = ${address.toLowerCase()} AND land_id = ${landId}`

        res.json({
            message: "Land put off sale",
        })

    }
    
    
}