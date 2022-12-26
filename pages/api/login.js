import { uuid } from "uuidv4"
import bcryptjs from "bcryptjs"
import conn from "utils/dbConnection"

const jwt = require("jsonwebtoken")

export default async function handler(req, res) {
    const { address } = req.body
    
    const checkSessionQuery = await conn.query(`Select * from sessions where address = $1 and status = 'Active'`, [address.toLowerCase()])
    
    if(!checkSessionQuery.rows.length>0 && address) {
        console.log('adding')
        const sessionID = uuid()
        const salt = bcryptjs.genSaltSync(10)
        const key = bcryptjs.hashSync("BlockEstate", salt) 
    
        const token = jwt.sign({ sessionID, address }, key)
    
        const insertSessionQuery = await conn.query(`Insert into sessions(address,session_id,token,status) Values ($1,$2,$3,$4)`, 
        [address, sessionID, token, "Active"])
        
        res.json({
            sessionID,
            address,
            token,
            status: "Active"
        })
    }
    else {
        res.json({
            sessionID: checkSessionQuery.rows[0].session_id,
            address: checkSessionQuery.rows[0].address,
            token: checkSessionQuery.rows[0].token,
            status: "Active"
        })
    }
 
}