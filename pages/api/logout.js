import conn from "utils/dbConnection"
const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()


export default async function handler(req, res) {
    const { address, session_id } = req.body
    
    //const logoutQuery = await conn.query(`Update sessions set status = 'Expired' where address = $1 and session_id = $2`, [address.toLowerCase(), session_id])

    const logout = await prisma.$queryRaw(Prisma.sql`Update sessions set status = 'Expired' where address = ${address} and session_id = ${session_id};`)//, [address, session_id]
    res.json({message: "User Logged Out"})
}