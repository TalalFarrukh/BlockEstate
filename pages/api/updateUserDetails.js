const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

export default async function handler(req, res) {

    const { address, firstName, lastName, email, contact } = req.body

    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM users WHERE address = ${address.toLowerCase()}`)

    if(checkQuery.length>0) {

        const updateQuery = await prisma.$executeRaw`UPDATE users SET first_name = ${firstName}, last_name = ${lastName}, email = ${email}, contact = ${contact}
        WHERE address = ${address.toLowerCase()}`

        if(updateQuery) {
            res.json({
                message: "User details updated",
                status: true
            })
        }
        else {
            res.json({
                message: "Failed to update user details",
                status: false
            })
        }
        

    }
    else {
        res.json({
            message: "User does not exist",
            status: false
        })
    }

    


}