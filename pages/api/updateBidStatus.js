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

    const { landId, sellerAddress, buyerAddress, bidStatus } = req.body

    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * from bid_requests WHERE buyer_address = ${buyerAddress.toLowerCase()} AND seller_address = ${sellerAddress.toLowerCase()} AND land_id = ${parseInt(landId)}`)

    if(checkQuery.length > 0) {

        const updateQuery = await prisma.$executeRaw`UPDATE bid_requests SET is_status = ${bidStatus} 
        WHERE buyer_address = ${buyerAddress.toLowerCase()} AND seller_address = ${sellerAddress.toLowerCase()} AND land_id = ${parseInt(landId)}`

        if(updateQuery) {
            res.json({
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