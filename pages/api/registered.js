import conn from "utils/dbConnection"

export default async function handler(req, res) {

    const { address } = req.body
    
    const checkQuery = await conn.query(`Select is_registered from users where address = $1`, [address.toLowerCase()])
    
    if(checkQuery.rows.length > 0) {
        res.json({
            isRegistered: checkQuery.rows[0].is_registered
        })
    }
    else {
        res.json({
            message: "CNIC does not exist"
        })
    }
    
    
}