import conn from "utils/dbConnection"
const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()


export default async function handler(req, res) {

    const { address, firstName, lastName, email, contact } = req.body
    
    //const checkQuery = await conn.query(`Select * from users where address = $1`, [address.toLowerCase()])
    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM users WHERE address = ${address}`)//, [address.toLowerCase()] )
    console.log("checking checkquery first element");
    console.log(checkQuery[0]);
    console.log(checkQuery.length);   
    //const x = checkQuery.length;
    //console.log(checkQuery[(x-1)]);
    //console.log(checkQuery[0].is_registered);

    //if(checkQuery[0].is_registered === "1" && Object.keys(checkQuery).length>0) {
    if(checkQuery[0].is_registered === "1" && checkQuery.length>0) {

        console.log("if satisfied");

        //const insertQuery = await conn.query(`Update users set first_name = $1, last_name = $2, email = $3, contact = $4,
        //is_registered = '2' where address = $5 returning is_registered`, [firstName, lastName, email, contact, address.toLowerCase()])
        const insertQuery = await prisma.$executeRaw`UPDATE users SET first_name = ${firstName}, last_name = ${lastName}, email = ${email}, contact = ${contact},
        is_registered = '2' WHERE address = ${address}`//, [firstName, lastName, email, contact, address.toLowerCase()])
        const fetchResult = await prisma.$queryRaw(Prisma.sql`SELECT * FROM users WHERE address = ${address} AND is_registered = '2'`)

        console.log(insertQuery);
        console.log(fetchResult);
        console.log(fetchResult[0].is_registered);

        res.json({
            message: "Details Registered",
            isRegistered: fetchResult[0].is_registered
        })
    }
    else {
        res.json({message: "Details already registered"})
    }
}