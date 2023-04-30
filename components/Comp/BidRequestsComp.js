import { useEffect, useState } from "react"
import { encrypt, decrypt } from "utils/crypt"
import { Bounce, Flip, toast, ToastContainer, Zoom } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const BidRequestsComp = ({ address, web3Api, apiKey, router }) => {

    const [landId, setLandId] = useState(null)

    const [bidRequest, setBidRequest] = useState([])

    const [refreshStatus, setRefreshStatus] = useState(false)

    useEffect(() => {
        if(!router.isReady) return
        setLandId(decrypt(router.query.landId))
    }, [router.isReady])

    useEffect(() => {
        const getAllBidRequests = async () => {
            
            const response = await fetch("api/bid/getBidRequestList", {
                method: "POST",
                body: JSON.stringify({ landId, address, apiKey }),
                headers: {
                  'Content-Type': 'application/json'
                }
            })
            
            const data = await response.json()
            
            if(!data) return
            setBidRequest(data.bidRequest)

        }

        address && landId && getAllBidRequests()

    }, [landId, address, refreshStatus])

    const acceptBid = async (e, request) => {
        e.preventDefault()
        
        const status = "Off Sale"
        const bidStatus = "1"
        
        const buyerAddress = request.buyer_address
        const sellerAddress = address

        const acceptedPrice = request.bid_price
  
        const updateBid = await fetch("api/transaction/updateBidStatus", {
          method: "POST",
          body: JSON.stringify({ landId, sellerAddress, buyerAddress, acceptedPrice, bidStatus, apiKey }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
  
        const updateData = await updateBid.json()
        if(!updateData) return
  
        const response = await fetch("api/landSale/setLandSale", {
            method: "POST",
            body: JSON.stringify({ landId, address, status, apiKey }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
  
        const data = await response.json()
        if(!data) return

        router.push({
            pathname: "Transaction",
            query: {
                id: encrypt(updateData.id)
            }
        })
  
    }
  
    const rejectBid = async (e, request) => {
        e.preventDefault()
        
        const status = "Remove One"

        const buyerAddress = request.buyer_address
        const sellerAddress = address

        const response = await fetch("api/bid/rejectBid", {
            method: "POST",
            body: JSON.stringify({ landId, sellerAddress, buyerAddress, status, apiKey }),
            headers: {
            'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        if(!data) return

        toast.error(data.message, {
            position: toast.POSITION.BOTTOM_RIGHT
        })
        
        setRefreshStatus(!refreshStatus)

    }


  return (
    <div className="flex flex-col">

        <div className="items-center">
            <h1 className="md:text-3xl text-xl text-center font-bold md:m-4 m-2">Bid Requests for Land #{landId}</h1>
            <div className="flex-1 bg-gray-600 h-px"></div>
        </div>

        <div className="md:flex flex-wrap justify-between md:p-4 p-2">
        
            {bidRequest ? bidRequest.map(request => {return request ?
                <>
                    <div className="flex flex-col justify-between max-w-xl md:w-2/4 m-4">
                        <div className="bg-gray-700 rounded-lg shadow-lg p-2 text-white">
                            <div className="w-2/5/5 p-3 md:text-lg text-sm text-center">
                                <div className="mb-2" style={{wordWrap: 'break-word'}}>Buyer's Address: {request.buyer_address}</div>  
                                <div className="mb-4">Bid Price: {request.bid_price}</div>
                                <button onClick={e => acceptBid(e, request)} className="rounded-lg bg-green-600 hover:bg-green-400 text-white mx-4 px-8 py-1 inline-block font-bold">Accept</button>
                                <button onClick={e => rejectBid(e, request)} className="rounded-lg bg-red-600 hover:bg-red-400 text-white px-8 py-1 inline-block font-bold">Decline</button>
                            </div>
                        </div>
                    </div>
                </>
            :null }) :null}
        
        </div>

        <ToastContainer limit={1} autoClose={1800} hideProgressBar={true} pauseOnFocusLoss={false} theme="colored" transition={Flip} closeOnClick={false} />

    </div>
  )
}

export default BidRequestsComp