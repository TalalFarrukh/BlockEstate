import conn from "utils/dbConnection"

export default async function handler(req, res) {
    const { address, cnic } = req.body
    
    const checkQuery = await conn.query(`Select * from users where address = $1 and cnic = $2`, [address.toLowerCase(), cnic])
    
    if(!checkQuery.rows.length>0 && address && cnic) {
        
        const registerQuery = await conn.query(`Insert into users(address,cnic,is_registered) Values ($1,$2,'1') returning is_registered`, [address.toLowerCase(), cnic])
        
        res.json({
            message: "CNIC registered",
            isRegistered: registerQuery.rows[0].is_registered
        })
    }
    else {
        res.json({message: "User CNIC already registered"})
    }

    
}