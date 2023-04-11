import { useEffect, useState } from "react"

import LandBuyCard from "./cards/LandBuyCard"

const BuyLandComp = ({ land, sellerAddress, askPrice, landId, apiKey, address }) => {

  const [refreshStatus, setRefreshStatus] = useState(false)

  const [isSubmitted, setIsSubmitted] = useState(false)

  const [bidPrice, setBidPrice] = useState(null)

  useEffect(() => {
    const checkSubmitBid = async () => {
      const response = await fetch("api/checkSubmitBid", {
        method: "POST",
        body: JSON.stringify({ landId, address, sellerAddress, apiKey }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if(!data) return
      setIsSubmitted(data.status)
      if(data.status) setBidPrice(data.bidPrice)
      
    }

    address && landId && checkSubmitBid()

  }, [landId, address, refreshStatus])

  const submitBid = async (e) => {
    e.preventDefault()

    const buyerBidPrice = e.target.bidPrice.value
    const status = "Submit"
    const buyerAddress = address

    const response = await fetch("api/submitBid", {
      method: "POST",
      body: JSON.stringify({ landId, sellerAddress, buyerAddress, askPrice, buyerBidPrice, status, apiKey }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if(!data) return
    setRefreshStatus(!refreshStatus)

  }

  const removeBid = async (e) => {
    e.preventDefault()

    const buyerBidPrice = 0
    const status = "Remove"
    const buyerAddress = address

    const response = await fetch("api/submitBid", {
      method: "POST",
      body: JSON.stringify({ landId, sellerAddress, buyerAddress, askPrice, buyerBidPrice, status, apiKey }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if(!data) return
    setRefreshStatus(!refreshStatus)

  }

  return (
    <div className="flex flex-col">

      <div className="items-center">
        <h1 className="md:text-3xl text-xl text-center font-bold md:m-4 m-2">Buy Land</h1>
        <div className="flex-1 bg-gray-600 h-px"></div>
      </div>

      <div className="flex flex-col md:flex-row md:p-5 p-2">
        
        <LandBuyCard land={land} sellerAddress={sellerAddress} askPrice={askPrice} />

        <div className="max-w-xl md:w-1/2 m-3 flex flex-col justify-center md:ml-6 mt-5 md:mt-0">
        {!isSubmitted ? 
          <>
            <h2 className="font-semibold text-2xl text-center mb-3">Submit Bid</h2>
            <form onSubmit={submitBid}>
              <div className="flex flex-col mb-4">
                <label htmlFor="bidAmount" className="mb-1 font-bold">Bid Amount</label>
                <input type="number" placeholder="Bid Price" name="bidPrice" required className="px-4 py-2 border border-gray-300 rounded-md" />
              </div>

              <div className="flex justify-center">
                <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-4/5">
                  Submit Bid
                </button>
              </div>
            </form>
          </>
          :
          <>
            <h2 className="font-semibold text-2xl text-center mb-3">Bid Submitted!</h2>
            <div className="flex flex-col mb-4">
              <div className="font-bold text-center">Bid Amount: {bidPrice}</div>
            </div>

            <div className="flex justify-center">
              <button type="button" onClick={removeBid} className="bg-blue-500 hover:bg-blue-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-4/5">
                Remove Bid
              </button>
            </div>
          </>
        }
        </div>
        
      </div>

    </div>
  )
}

export default BuyLandComp