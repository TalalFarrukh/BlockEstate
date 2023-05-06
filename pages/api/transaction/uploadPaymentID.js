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

    const { id, paymentID, userStatus } = req.body

    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * from bid_requests WHERE id = ${id}`)

    if(checkQuery.length > 0) {

        if(userStatus === "Buyer") {
            const updateQuery = await prisma.$executeRaw`UPDATE bid_requests SET buyer_payment_id = ${paymentID} WHERE id = ${id}`
        }
        else if(userStatus === "Seller") {
            const updateQuery = await prisma.$executeRaw`UPDATE bid_requests SET seller_payment_id = ${paymentID} WHERE id = ${id}`
        }

        res.json({
            message: "Receipt uploaded",
            status: true
        })

    }
    else {
        res.json({
            message: "Error in upload",
            status: false
        })
    }

}

export default requireAuth(handler)