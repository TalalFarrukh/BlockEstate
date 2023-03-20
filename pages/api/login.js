import { uuid } from "uuidv4"
import bcryptjs from "bcryptjs"
const { PrismaClient, Prisma } = require('@prisma/client')

const prisma = new PrismaClient()

const jwt = require("jsonwebtoken")

export default async function handler(req, res) {
    const { address, sessionStatus } = req.body

    const checkSessionQuery = await prisma.$queryRaw(Prisma.sql`SELECT * FROM sessions WHERE address = ${address.toLowerCase()} AND status = 'Active'`)

    if(!checkSessionQuery.length>0 && address && sessionStatus === 1) {
        
      const sessionID = uuid()
      const salt = bcryptjs.genSaltSync(10)
      const key = bcryptjs.hashSync("BlockEstate", salt) 
  
      const token = jwt.sign({ sessionID, address }, key)
  
      const insertSessionQuery = await prisma.sessions.create({
        data: {
          address: address,
          session_id: sessionID,
          token: token,
          status: 'Active',
        },
      })
      
      res.json({
        sessionID,
        address,
        token,
        status: "Active"
      })
    }
    else if(!checkSessionQuery.length>0 && address) {
      res.json(null)
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