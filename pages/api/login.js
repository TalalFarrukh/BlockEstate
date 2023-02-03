import { uuid } from "uuidv4"
import bcryptjs from "bcryptjs"
//import conn from "utils/dbConnection"
const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')

const prisma = new PrismaClient()



const jwt = require("jsonwebtoken")

export default async function handler(req, res) {
    const { address } = req.body
    console.log(address);
    //const checkSessionQuery = await conn.query(`Select * from sessions where address = $1 and status = 'Active'`, [address.toLowerCase()])
    const checkSessionQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM sessions WHERE address = ${address} AND status = 'Active'`)/*,  [address.toLowerCase()]*/
    console.log(checkSessionQuery);
    console.log(checkSessionQuery.length);
    //console.log(checkSessionQuery[0].session_id);
    //console.log(Object.keys(checkSessionQuery[0]));
    //console.log(Object.keys(checkSessionQuery[0]).length);
    //const checkSessionQueryy = JSON.stringify(checkSessionQueryx);
    //const checkSessionQuery = JSON.parse(checkSessionQueryy);
    
   /* if (Object.keys(checkSessionQuery[0]).length >0) {
        console.log("works",Object.keys(checkSessionQuery[0]) );
      } else {
        console.log("Doesnt work");
    }
    console.log(Object.keys(checkSessionQuery[0]).rows)*/



    //console.log(checkSessionQuery);
    //console.log(checkSessionQuery[1].session_id);

    if(!checkSessionQuery.length>0 && address) {
        
        const sessionID = uuid()
        const salt = bcryptjs.genSaltSync(10)
        const key = bcryptjs.hashSync("BlockEstate", salt) 
    
        const token = jwt.sign({ sessionID, address }, key)
    
        //const insertSessionQuery = await conn.query(`Insert into sessions(address,session_id,token,status) Values ($1,$2,$3,$4)`, 
        //[address.toLowerCase(), sessionID, token, "Active"])
        const insertSessionQuery = await prisma.sessions.create({
            data: {
              address: address,
              session_id: sessionID,
              token: token,
              status: 'Active',
            },
          })
          //console.log(checkSessionQuery.rows[0].session_id);
        
        res.json({
            sessionID,
            address,
            token,
            status: "Active"
        })
    }
    else {
        res.json({
            sessionID: checkSessionQuery[0].session_id,
            address: checkSessionQuery[0].address,
            token: checkSessionQuery[0].token,
            status: "Active"
        })
    }
 
}