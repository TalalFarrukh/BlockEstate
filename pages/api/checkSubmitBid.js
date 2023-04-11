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

    const { landId, address, sellerAddress } = req.body
    
    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * from bid_requests WHERE buyer_address = ${address.toLowerCase()} AND seller_address = ${sellerAddress.toLowerCase()} AND land_id = ${parseInt(landId)}`)

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

export default requireAuth(handler)