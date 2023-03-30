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

    const { address, firstName, lastName, email, contact } = req.body
    
    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM users WHERE address = ${address.toLowerCase()}`)

    if(checkQuery[0].is_registered === "1" && checkQuery.length>0) {
        
        const insertQuery = await prisma.$executeRaw`UPDATE users SET first_name = ${firstName}, last_name = ${lastName}, email = ${email}, contact = ${contact},
        is_registered = '2' WHERE address = ${address.toLowerCase()}`

        const fetchResult = await prisma.$queryRaw(Prisma.sql`SELECT * FROM users WHERE address = ${address.toLowerCase()} AND is_registered = '2'`)

        res.json({
            message: "Details Registered",
            isRegistered: fetchResult[0].is_registered
        })
    }
    else {
        res.json({message: "Details already registered"})
    }
}

export default requireAuth(handler)