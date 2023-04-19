const { Prisma } = require("@prisma/client")
import prisma from "utils/dbConnection"

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

    const { transactionId, userStatus } = req.body

    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * from bid_requests WHERE id = ${transactionId}`)
    
    if(checkQuery.length > 0) {
        
        if(userStatus === "Seller") {
            const updateQuery = await prisma.$executeRaw`UPDATE bid_requests SET is_seller_signed = ${"1"} WHERE id = ${transactionId}`
        }
        else if(userStatus === "Buyer") {
            const updateQuery = await prisma.$executeRaw`UPDATE bid_requests SET is_buyer_signed = ${"1"} WHERE id = ${transactionId}`
        }
        
        res.json({
            message: `${userStatus} has signed the document!`,
            status: true
        })

        const checkStatus = await prisma.$queryRaw(Prisma.sql`SELECT * from bid_requests WHERE id = ${transactionId}`)

        if(checkStatus[0].is_buyer_signed === "1" && checkStatus[0].is_seller_signed === "1") {
          const updateStatus = await prisma.$executeRaw`UPDATE bid_requests SET is_status = ${"2"} WHERE id = ${transactionId}`
        }
        
    }

}

export default requireAuth(handler)