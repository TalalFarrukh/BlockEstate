import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "./utils/load-contract"


const three = () => {

    const [address, setAddress] = useState("0x294a60E096abbb9c77178a55A059E2f58d8409B7")

    const [refreshStatus, setRefreshStatus] = useState(false)

    const [isSubmitted, setIsSubmitted] = useState(false)

    const [landId, setLandId] = useState(null)
    const [sellerAddress, setSellerAddress] = useState(null)
    const [askPrice, setAskPrice] = useState(null)

    const [bidPrice, setBidPrice] = useState(null)

    const router = useRouter()

    useEffect(() => {
        if(!router.isReady) return
        setLandId(router.query.landId)
        setSellerAddress(router.query.sellerAddress)
        setAskPrice(router.query.askPrice)
      }, [router.isReady])


    useEffect(() => {

      const checkSubmitBid = async () => {
        const response = await fetch("api/checkSubmitBid", {
          method: "POST",
          body: JSON.stringify({ landId, address }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const data = await response.json()
        
        if(!data) return
        else {
          setIsSubmitted(data.status)
          if(data.status) setBidPrice(data.bidPrice)
        }

      }

      address && landId && checkSubmitBid()

    }, [landId, address, refreshStatus])

    const submitBid = async (e) => {
      e.preventDefault()

      const buyerBidPrice = e.target.bidPrice.value

      const status = "Submit"

      const response = await fetch("api/submitBid", {
        method: "POST",
        body: JSON.stringify({ landId, sellerAddress, address, askPrice, buyerBidPrice, status }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
  
      if(!data) return
      else setRefreshStatus(!refreshStatus)

    }

    const removeBid = async (e) => {
      e.preventDefault()

      const buyerBidPrice = 0

      const status = "Remove"

      const response = await fetch("api/submitBid", {
        method: "POST",
        body: JSON.stringify({ landId, sellerAddress, address, askPrice, buyerBidPrice, status }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if(!data) return
      else setRefreshStatus(!refreshStatus)

    }


  return (
    <div>
      <div>Land ID: {landId}</div>
      <div>Seller Address: {sellerAddress}</div>
      <div>Ask Price: {askPrice}</div>

      {isSubmitted ?
        <>
          <div>
            Bid submitted
            <div>Bid Price: {bidPrice}</div>
            <button type="button" onClick={removeBid}>Remove Bid</button>
          </div>
        </>

      :
        <>
          <div>Submit bid:</div>

          <form onSubmit={submitBid}>
            <input type="number" placeholder="Bid Price" name="bidPrice" required />
            <button type="submit">Submit</button>
          </form>
        </>
      }


    </div>
  )
}

export default three