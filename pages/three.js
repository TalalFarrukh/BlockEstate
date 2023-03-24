import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "./utils/load-contract"


const three = () => {

  const router = useRouter()

  const [address, setAddress] = useState("0x294a60E096abbb9c77178a55A059E2f58d8409B7")

  const [landId, setLandId] = useState(null)
  const [sellerAddress, setSellerAddress] = useState(null)
  const [sellerPrice, setSellerPrice] = useState(null)

  useEffect(() => {
    if(!router.isReady) return
    setLandId(router.query.landId)
  }, [router.isReady])

  useEffect(() => {//this will be run at the time of page load along with the sessions

    const checkLandSale = async () => {

      if(!landId) return
      else {
        
        const response = await fetch("api/getSellerLandSale", {
            method: "POST",
            body: JSON.stringify({ landId }),
            headers: {
              'Content-Type': 'application/json'
            }
        })

        const data = await response.json()

        if(data.status) {
          setSellerAddress(data.address)
          setSellerPrice(data.price)
        }

      }
    }

    checkLandSale()

  }, [landId])


  return (
    <div>

      <div>Seller Address: {sellerAddress}</div>
      <div>Price: {sellerPrice}</div>


    </div>
  )
}

export default three