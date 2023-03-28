const { PrismaClient } = require('@prisma/client')
const { Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

export default async function handler(req, res) {

    const { landId, sellerAddress, address, askPrice, buyerBidPrice, status } = req.body


    if(status === "Submit") {
        const insertQuery = await prisma.$executeRaw`INSERT INTO bid_requests (land_id, seller_address, buyer_address, ask_price, bid_price)
        VALUES (${parseInt(landId)}, ${sellerAddress.toLowerCase()}, ${address.toLowerCase()}, ${parseFloat(askPrice)}, ${parseFloat(buyerBidPrice)})`
    
        res.json({
            message: "Bid submitted!",
            status: true
        })
    }
    else if(status === "Remove") {

        const deleteQuery = await prisma.$executeRaw`DELETE FROM bid_requests WHERE buyer_address = ${address.toLowerCase()} AND land_id = ${parseInt(landId)}`

        res.json({
            message: "Bid removed",
        })

    }


    

}