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

    const { address } = req.body

    const getQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM land_sale WHERE address NOT IN (${address.toLowerCase()})`)

    if(getQuery.length>0) {
        res.json({
            landOnSale: getQuery,
            message: `${getQuery.length} land available for sale`
        })
    }
    else {
        res.json({
            message: "No land available on sale"
        })
    }

}

export default requireAuth(handler)