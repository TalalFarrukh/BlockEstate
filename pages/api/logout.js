const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()


export default async function handler(req, res) {
    const { address, session_id } = req.body
    
    const logout = await prisma.$queryRaw(Prisma.sql`Update sessions set status = 'Expired' where address = ${address.toLowerCase()} and session_id = ${session_id};`)//, [address, session_id]
    
    res.json({
        message: "User Logged Out"
    })
}