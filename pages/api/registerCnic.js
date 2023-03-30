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
    const { address, cnic } = req.body

    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM users WHERE address = ${address.toLowerCase()} AND cnic = ${cnic}`)

    if(!checkQuery.length>0 && address && cnic) {
        
        const registerQuery = await prisma.users.create({
            data: {
              address: address,
              cnic: cnic,
              is_registered: '1',
            },
        })

        res.json({
            message: "CNIC registered",
            isRegistered: registerQuery.is_registered
        })
    }
    else {
        res.json({message: "User CNIC already registered"})
    }
}

export default requireAuth(handler)