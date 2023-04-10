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

    const { landId, sellerAddress, buyerAddress, status } = req.body

    if(status === "Remove One") {

        const deleteQuery = await prisma.$executeRaw`DELETE FROM bid_requests WHERE buyer_address = ${buyerAddress.toLowerCase()} AND seller_address = ${sellerAddress.toLowerCase()} AND land_id = ${parseInt(landId)}`

        res.json({
            message: "Bid removed"
        })

    }
    else if(status === "Remove All") {

        const deleteQuery = await prisma.$executeRaw`DELETE FROM bid_requests WHERE seller_address = ${sellerAddress.toLowerCase()} AND land_id = ${parseInt(landId)}`

        res.json({
            message: "Bid removed"
        })

    }

}

export default requireAuth(handler)