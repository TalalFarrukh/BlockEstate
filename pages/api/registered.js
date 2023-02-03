import conn from "utils/dbConnection"
const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()


export default async function handler(req, res) {

    const { address } = req.body
    
    //const checkQuery = await conn.query(`Select is_registered from users where address = $1`, [address.toLowerCase()])
    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT is_registered FROM users WHERE address = ${address}`)//, [address.toLowerCase()])
    //console.log(checkQuery);

    
    if(checkQuery[0].length > 0) {
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