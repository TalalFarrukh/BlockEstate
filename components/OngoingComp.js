import Link from "next/link"
import { useState, useEffect } from "react"

const OngoingComp = ({ address, apiKey }) => {

  const [transactionBid, setTransactionBid] = useState([])

  useEffect(() => {
    
    const getOngoingTransaction = async () => {

      const response = await fetch("api/getTransactionBidList", {
        method: "POST",
        body: JSON.stringify({ address, apiKey }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      console.log(data)
      if(!data) return
      setTransactionBid(data.transactionBid)

    }

    address && getOngoingTransaction()

  }, [address])



  return (
    <div className="flex flex-col">

        <div className="items-center">
            <h1 className="md:text-3xl text-xl text-center font-bold md:m-4 m-2">On-going Transactions</h1>
            <div className="flex-1 bg-gray-600 h-px"></div>
        </div>

        <div className="md:flex flex-wrap justify-between md:p-4 p-2">

          {transactionBid ? transactionBid.map(bid => {return bid ?
            <div className="flex flex-col justify-between max-w-xl md:w-2/4 m-4">
              <div className="bg-gray-700 rounded-lg shadow-lg p-2 text-white">
                <div className="w-2/5/5 p-3 md:text-lg text-sm text-center">
                  <h1 className="mb-2 font-bold">Transaction #{bid.id}</h1>
                  <div className="mb-2" style={{wordWrap: 'break-word'}}>Buyers Address: {bid.buyer_address}</div>  
                  <div className="mb-4" style={{wordWrap: 'break-word'}}>Seller Address: {bid.seller_address}</div>
                  <Link href="#" className="rounded-lg bg-yellow-600 hover:bg-yellow-400 text-white px-8 py-1 inline-block font-bold">Continue</Link>
                </div>
              </div>
            </div>
          :null }) :null}
          
        </div>

    </div>
  )
}

export default OngoingComp