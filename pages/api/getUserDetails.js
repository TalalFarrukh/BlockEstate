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

    const getQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM users WHERE address = ${address.toLowerCase()}`)

    res.json({
        address: getQuery[0].address,
        cnic: getQuery[0].cnic,
        firstName: getQuery[0].first_name,
        lastName: getQuery[0].last_name,
        email: getQuery[0].email,
        contact: getQuery[0].contact,
        isRegistered: getQuery[0].is_registered
    })

}

export default requireAuth(handler)