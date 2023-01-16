import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "./utils/load-contract"
import c2 from "../commercial/commercial_c2.json"

const pagetwo = () => {

  const router = useRouter()

  const [address, setAddress] = useState(null)

  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
    landToken: null
  })

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()
      const landToken = await loadContract("LandToken", provider)
      
      if(provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          landToken
        })
      }
    }
    loadProvider()
  }, [])
  
  useEffect(() => {
    if(!router.isReady) return
    setAddress(router.query.address)
  }, [router.isReady])
  
  const mintToken = async (e) => {
    e.preventDefault()
    
    const { landToken, web3 } = web3Api

    const c1String = JSON.stringify(c2)
    const landTokenContract = await landToken.safeMint(address, c1String, {from:address})

    console.log(landTokenContract)

  }

  const getToken = async (e) => {
    e.preventDefault()

    const { landToken, web3 } = web3Api

    const landTokenContract = await landToken.tokenURI(1)

    // const c1Ascii = JSON.parse(web3.utils.hexToUtf8(c1Hex))

    console.log(JSON.parse(landTokenContract.toString()))
  }

  return (
    <>
      <div>
        Details have been registered and you have been redirected!!!
      </div>

      <div>
        Mint Token
        <button onClick={mintToken}>Mint Token</button>
      </div>

      <div>
        Token json file
        <button onClick={getToken}>Get Token</button>
      </div>
    </>
  )
}

export default pagetwo