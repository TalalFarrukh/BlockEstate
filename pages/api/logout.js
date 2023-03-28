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
    const { address, session_id } = req.body
    
    const logout = await prisma.$queryRaw(Prisma.sql`Update sessions set status = 'Expired' where address = ${address.toLowerCase()} and session_id = ${session_id};`)//, [address, session_id]
    
    res.json({
        message: "User Logged Out"
    })
}

export default requireAuth(handler)