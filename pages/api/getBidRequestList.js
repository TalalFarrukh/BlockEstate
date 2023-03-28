const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
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

    const { landId, address } = req.body

    const getQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM bid_requests WHERE seller_address = ${address.toLowerCase()} AND land_id = ${parseInt(landId)}`)

    if(getQuery.length>0) {
        res.json({
            bidRequest: getQuery,
            message: `${getQuery.length} bid requests made for this land`
        })
    }
    else {
        res.json({
            message: "No bid requests made"
        })
    }
}

export default requireAuth(handler)