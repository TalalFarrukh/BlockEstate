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

    const { address } = req.body

    const getQuery = await prisma.$queryRaw(Prisma.sql`SELECT * from bid_requests WHERE (seller_address = ${address.toLowerCase()} OR buyer_address = ${address.toLowerCase()}) AND (is_status NOT IN (${"0"}))`)
    
    if(getQuery.length > 0) {
      res.json({
        transactionBid: getQuery,
        status: true
      })
    }
    else {
      res.json({
        message: "No on going bids",
        status: false
      })
    }
    
}

export default requireAuth(handler)