import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "../utils/load-contract"

const pagetwo = () => {

  const router = useRouter()

  const [address, setAddress] = useState(null)

  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
    landToken: null
  })

  const [landExists, setLandExists] = useState(false)
  const [landExistsId, setLandExistsId] = useState(null)
  const [land, setLand] = useState(null)
  const [landTokenExists, setLandTokenExists] = useState(false)

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
    
    const landJsonString = JSON.stringify(land)
    const landTokenContract = await landToken.safeMint(address, landExistsId, landJsonString, {from:address})

    if(landTokenContract) {
      console.log(landTokenContract)
      setLandTokenExists(true)
    }
    
  }

  const getToken = async (e) => {
    e.preventDefault()

    const { landToken, web3 } = web3Api

    const landTokenURI = await landToken.tokenURI(1)

    console.log(JSON.parse(landTokenURI.toString()))
  }

  const checkLandExists = async (e) => {
    e.preventDefault()

    const landId = parseInt(e.target.landId.value)
    const cnic = e.target.cnic.value

    const response = await fetch("api/checkLandExists", {
      method: "POST",
      body: JSON.stringify({ landId, cnic }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    console.log(data.landJson)
    if(data.status) {
      setLandExists(data.status)
      setLandExistsId(landId)
      setLand(data.landJson)
    }
    else {
      //throw error
    }

  }

  const verifyNewLand = async (e) => {
    e.preventDefault()

    setLandExists(false)
    setLandExistsId(null)
    setLand(null)
    setLandTokenExists(false)
  }

  const getListOfAllTokens = async (e) => {
    e.preventDefault()

    const { landToken, web3 } = web3Api

    // const events = await landToken.getPastEvents('Transfer', {
    //   filter: {
    //     'from': '0x0000000000000000000000000000000000000000',
    //   },
    //   fromBlock: 0,
    //   toBlock: 'latest'
    // })

    const events = await landToken.getPastEvents('Transfer', {
      filter: {
        'to': address
      },
      fromBlock: 0,
      toBlock: 'latest'
    })
    
    // events.forEach(event => {
    //   console.log(typeof(event.returnValues.tokenId))
    // })
    console.log(events)
  }

  return (
    <>
      <div>
        Details have been registered and you have been redirected!!!
      </div>

      {!landExists && !landTokenExists ?
        <>
          <div>
            <form onSubmit={checkLandExists}>
              <input type="text" name="landId" placeholder="Land ID" required />
              <input type="text" name="cnic" placeholder="CNIC" minLength="13" maxLength="13" required />
              <button type="submit">Check Land</button>
            </form>
          </div>
        </>
      : landExists && !landTokenExists ?
        <>
          <div>
            Mint Token
            <button onClick={mintToken}>Generate Token</button>
          </div>
        </>
      : 
        <>
          <div>
            <button onClick={verifyNewLand}>Verfiy new land</button>
          </div>
        </>
      }


      <div>
        <form onSubmit={getListOfAllTokens}>
          {/* <input type="text" name="landId" placeholder="Land ID" required /> */}
          <button type="submit">Get Token List</button>
        </form>
      </div>

    </>
  )
}

export default pagetwo