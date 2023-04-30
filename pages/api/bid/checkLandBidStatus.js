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

    const { landId } = req.body

    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * from bid_requests WHERE land_id = ${parseInt(landId)} AND (is_status NOT IN (${"0"}))`)

    if(checkQuery.length > 0) {
        res.json({
          id: checkQuery[0].id,
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