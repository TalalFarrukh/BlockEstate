import conn from "utils/dbConnection"
const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()


export default async function handler(req, res) {
    const { address, cnic } = req.body
    console.log(address);
    console.log(cnic);

        /*const checkDset = await prisma.$queryRaw(Prisma.sql`SELECT * FROM users where address = ${address} AND cnic::varchar = ${cnic}`)
        console.log(checkDset);*/
    //const checkQuery = await conn.query(`Select * from users where address = $1 and cnic = $2`, [address.toLowerCase(), cnic])
    const checkQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM users WHERE address = ${address} AND cnic = ${cnic}`)
    console.log("Here");
    console.log(checkQuery.length);   
    console.log(checkQuery[0]);
    
    //console.log(Object.keys(checkQuery[0]).length);

    //if(!Object.keys(checkQuery[0]).length>0 && address && cnic) {
    if(!checkQuery.length>0 && address && cnic) {
        console.log("andar hu bhai");
        
        //const registerQuery = await conn.query(`Insert into users(address,cnic,is_registered) Values ($1,$2,'1') returning is_registered`, [address.toLowerCase(), cnic])
        //const registerQuery1 = await prisma.$queryRaw(Prisma.sql`INSERT INTO users(address,cnic,is_registered) VALUES (${address},${cnic},'1') RETURNING is_registered;`)//, [address.toLowerCase(), cnic]
        const registerQuery = await prisma.users.create({
            data: {
              address: address,
              cnic: cnic,
              is_registered: '1',
            },
          })
          console.log(registerQuery);
          console.log("here checking register query");

          console.log(registerQuery.is_registered);
        res.json({
            message: "CNIC registered",
            isRegistered: registerQuery.is_registered
        })
        //console.log(isRegistered);
    }
    else {
        res.json({message: "User CNIC already registered"})
    }

    
}