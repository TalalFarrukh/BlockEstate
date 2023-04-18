const { Prisma, PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

import bcryptjs from "bcryptjs"

function requireAuth(handler) {
    return async (req, res) => {
      
      const isAuthenticated = bcryptjs.compareSync("APIs", req.body.apiKey)
  
      if (isAuthenticated) {
        return await handler(req, res)
      }
  
      res.status(401).json({
        message: "Unauthorized"
      })
    }
}

async function handler(req, res) {

    const { landId, sellerAddress, buyerAddress, acceptedPrice, bidStatus } = req.body

    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * from bid_requests WHERE buyer_address = ${buyerAddress.toLowerCase()} AND seller_address = ${sellerAddress.toLowerCase()} AND land_id = ${parseInt(landId)}`)

    if(checkQuery.length > 0) {

        const updateQuery = await prisma.$executeRaw`UPDATE bid_requests SET is_status = ${bidStatus}, accepted_price = ${acceptedPrice}
        WHERE buyer_address = ${buyerAddress.toLowerCase()} AND seller_address = ${sellerAddress.toLowerCase()} AND land_id = ${parseInt(landId)}`

        if(updateQuery) {

            const fetchResult = await prisma.$queryRaw(Prisma.sql`SELECT * FROM bid_requests WHERE buyer_address = ${buyerAddress.toLowerCase()} AND seller_address = ${sellerAddress.toLowerCase()} AND land_id = ${parseInt(landId)} AND is_status = ${"1"}`)

            res.json({
                id: fetchResult[0].id,
                message: "Transaction is in next phase",
                status: true
            })
        }
        else {
            res.json({
                message: "Advancement to next phase failed",
                status: false
            })
        }

    }

}

export default requireAuth(handler)