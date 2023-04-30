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

    const { id } = req.body

    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * from bid_requests WHERE id = ${id}`)

    if(checkQuery.length > 0) {

        const updateQuery = await prisma.$executeRaw`UPDATE bid_requests SET is_buyer_paid = ${"1"} WHERE id = ${id}`

        if(updateQuery) {
            res.json({
                message: "Payment made",
                status: true
            })
        }
        else {
            res.json({
                message: "Error in payment",
                status: false
            })
        }

    }

}

export default requireAuth(handler)