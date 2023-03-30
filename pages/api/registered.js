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
    
    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT is_registered FROM users WHERE address = ${address.toLowerCase()}`)//, [address.toLowerCase()])
    
    if(checkQuery.length > 0) {
        res.json({
            isRegistered: checkQuery[0].is_registered
        })
    }
    else {
        res.json({
            message: "CNIC does not exist"
        })
    }
    
}

export default requireAuth(handler)