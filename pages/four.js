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

            console.log(data.bidRequest)

        }

        address && landId && getAllBidRequests()

    }, [landId, address])


  return (
    <div>four</div>
  )
}

export default four