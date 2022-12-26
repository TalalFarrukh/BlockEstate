import conn from "utils/dbConnection"

export default async function handler(req, res) {

    const { address, firstName, lastName, email, contact } = req.body
    
    const checkQuery = await conn.query(`Select * from users where address = $1`, [address])
       
    if(checkQuery.rows[0].is_registered === "1" && checkQuery.rows.length>0) {

        const insertQuery = await conn.query(`Update users set first_name = $1, last_name = $2, email = $3, contact = $4,
        is_registered = '2' where address = $5 returning is_registered`, [firstName, lastName, email, contact, address])
        
        res.json({
            message: "Details Registered",
            isRegistered: insertQuery.rows[0].is_registered
        })
    }
    else {
        res.json({message: "Details already registered"})
    }

}