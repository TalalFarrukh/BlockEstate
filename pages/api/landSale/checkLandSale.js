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

    const { landId, address } = req.body
    
    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM land_sale WHERE address = ${address.toLowerCase()} AND land_id = ${landId}`)
    
    if(checkQuery.length > 0) {
        res.json({
            price: checkQuery[0].price,
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