const { Prisma, PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

import bcryptjs from "bcryptjs"

function requireAuth(handler) {
    return async (req, res) => {
      
      const isAuthenticated = bcryptjs.compareSync("APIs", req.body.apiKey)
  
      if (isAuthenticated) {
        return await handler(req, res)
      }
  
      res.status(401).json({
        message: "Unauthorized"
      })
    }
}

async function handler(req, res) {

    const { landId, sellerAddress, buyerAddress, askPrice, buyerBidPrice, status } = req.body

    if(status === "Submit") {
        const insertQuery = await prisma.$executeRaw`INSERT INTO bid_requests (land_id, seller_address, buyer_address, ask_price, bid_price)
        VALUES (${parseInt(landId)}, ${sellerAddress.toLowerCase()}, ${buyerAddress.toLowerCase()}, ${parseFloat(askPrice)}, ${parseFloat(buyerBidPrice)})`
    
        res.json({
            message: "Bid submitted!",
            status: true
        })
    }
    else if(status === "Remove") {

        const deleteQuery = await prisma.$executeRaw`DELETE FROM bid_requests WHERE buyer_address = ${buyerAddress.toLowerCase()} AND land_id = ${parseInt(landId)} AND is_status = ${"0"}`

        res.json({
            message: "Bid removed!",
            status: false
        })

    }
    
}

export default requireAuth(handler)