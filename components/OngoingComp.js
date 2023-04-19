import { useState, useEffect } from "react"
import { encrypt } from "utils/crypt"

const OngoingComp = ({ address, router, apiKey }) => {

  const [transactionBid, setTransactionBid] = useState([])

  useEffect(() => {
    
    const getOngoingTransaction = async () => {

      const response = await fetch("api/transaction/getTransactionBidList", {
        method: "POST",
        body: JSON.stringify({ address, apiKey }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
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
              <div className="bg-gray-700 rounded-lg shadow-lg text-white">
                <div className="w-2/5/5 p-3 md:text-lg text-sm text-center">
                <div className="mb-2">Seller's Address: {bid.seller_address}</div>  
                <div className="mb-4">Accepted Price: {bid.accepted_price}</div>
                  <button onClick={(e) => {
                    router.push({
                        pathname: "one",
                        query: {
                            id: encrypt(bid.id),
                        }
                    })
                  }} className="rounded-lg bg-green-600 hover:bg-green-400 text-white mx-4 px-8 py-1 inline-block font-bold">Continue Transaction</button>
                </div>
              </div>
            </div>
          :null }) :null}
          
        </div>

    </div>
  )
}

export default OngoingComp