import conn from "utils/dbConnection"

export default async function handler(req, res) {
    const { address, session_id } = req.body
    
    const logoutQuery = await conn.query(`Update sessions set status = 'Expired' where address = $1 and session_id = $2`, [address, session_id])

    res.json({message: "User Logged Out"})
}