import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import bcryptjs from "bcryptjs"

const apiSalt = bcryptjs.genSaltSync(10)
const apiKey = bcryptjs.hashSync("APIs", apiSalt)

const four = () => {

    const [address, setAddress] = useState("0x34E9aE971ce73Aa51Cf44656559265cAe4655AB6")

    const [landId, setLandId] = useState(null)
    const [bidRequest, setBidRequest] = useState([])

    const router = useRouter()

    const [refreshStatus, setRefreshStatus] = useState(false)

    useEffect(() => {
        if(!router.isReady) return
        setLandId(router.query.landId)
    }, [router.isReady])

    useEffect(() => {

        const getAllBidRequests = async () => {
            
            const response = await fetch("api/getBidRequestList", {
                method: "POST",
                body: JSON.stringify({ landId, address, apiKey }),
                headers: {
                  'Content-Type': 'application/json'
                }
            })
            
            const data = await response.json()
            
            if(!data) return
            else setBidRequest(data.bidRequest)

        }

        address && landId && getAllBidRequests()

    }, [landId, address, refreshStatus])

    const acceptBid = async (e, request) => {
      e.preventDefault()
      
      const status = "Remove All"
      const bidStatus = "1"
      
      const buyerAddress = request.buyer_address
      const sellerAddress = address

      const updateBid = await fetch("api/updateBidStatus", {
        method: "POST",
        body: JSON.stringify({ landId, sellerAddress, buyerAddress, bidStatus, apiKey }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const updateData = await updateBid.json()
      if(!updateData) return

      const response = await fetch("api/rejectBid", {
        method: "POST",
        body: JSON.stringify({ landId, sellerAddress, buyerAddress, status, apiKey }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if(!data) return

    }

    const rejectBid = async (e, request) => {
      e.preventDefault()
      
      const status = "Remove One"

      const response = await fetch("api/rejectBid", {
        method: "POST",
        body: JSON.stringify({ landId, buyerAddress, status, apiKey }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if(!data) return
      
      setRefreshStatus(!refreshStatus)

    }


  return (
    <div>
 
      {bidRequest ? bidRequest.map(request => {return request ?

        <>
          <div>Bid Request: {request.id}</div>
          <button onClick={e => acceptBid(e, request)}>Accept Bid</button>
          <button onClick={e => rejectBid(e, request)}>Reject Bid</button>
        </>

      :null})
      :null}
 
    </div>
  )
}

export default four