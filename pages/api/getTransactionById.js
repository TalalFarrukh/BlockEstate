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

    const { transactionId } = req.body

    const getQuery = await prisma.$queryRaw(Prisma.sql`SELECT * from bid_requests WHERE id = ${transactionId}`)
    
    if(getQuery.length > 0) {
      res.json({
        transaction: getQuery[0],
        status: true
      })
    }
    else {
      res.json({
        message: "Transaction not found",
        status: false
      })
    }
    
}

export default requireAuth(handler)