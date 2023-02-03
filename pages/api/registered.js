const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()


export default async function handler(req, res) {

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