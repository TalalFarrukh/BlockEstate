import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "./utils/load-contract"


const three = () => {

    const [landId, setLandId] = useState(null)

    const router = useRouter()

    useEffect(() => {
        if(!router.isReady) return
        setLandId(router.query.landId)
      }, [router.isReady])

    useEffect(() => {
        console.log(landId)
    }, [])


  return (
    <div>{landId}</div>
  )
}

export default three