import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "../utils/load-contract"

import bcryptjs from "bcryptjs"

const apiSalt = bcryptjs.genSaltSync(10)
const apiKey = bcryptjs.hashSync("APIs", apiSalt)

const pagetwo = () => {

    const router = useRouter()

    const [address, setAddress] = useState("0x294a60E096abbb9c77178a55A059E2f58d8409B7")
    const [sessionDetails, setSessionDetails] = useState({
        sessionID: null,
        address: null,
        token: null,
        status: null
    })

    const [sessionStatus, setSessionStatus] = useState(0)
    const [isLogout, setIsLogout] = useState(false)

    const [web3Api, setWeb3Api] = useState({
        web3: null,
        provider: null,
        landToken: null
    })

    const [testLands, setTestLands] = useState([])

    const logout = async () => {

        const session_id = sessionDetails.sessionID

        const response = await fetch("api/logout", {
            method: "POST",
            body: JSON.stringify({ address, session_id, apiKey }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        setIsLogout(true)
        setAddress(null)
        setSessionDetails({
            sessionID: null,
            address: null,
            token: null,
            status: null
        })

        router.push({
          pathname: "/",
        })

    }

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
        const getSessionDetails = async () => {
          if(isLogout) return
          if(!await web3Api.web3.eth.getAccounts()) return 
          else {
            if(!address) {
              const accounts = await web3Api.web3.eth.getAccounts()
              setAddress(accounts[0])
            }
    
            if(address) {
              const response = await fetch("api/login", {
                method: "POST",
                body: JSON.stringify({ address, sessionStatus, apiKey }),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              
              const data = await response.json()

              if(!data) return
              else setSessionDetails(data)
              
            }
          }
        }
    
        web3Api.web3 && getSessionDetails()
    
    }, [web3Api.web3, address])


    useEffect(() => {
        ethereum.on("accountsChanged", (accounts) => {
          if(!accounts.length) {
            logout()
          }
        })  
      })

    useEffect(() => {

      const getAllLandSale = async () => {

        const response = await fetch("api/getAllLandSale", {
          method: "POST",
          body: JSON.stringify({ address, apiKey }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        const data = await response.json()

        if(!data) return
        setTestLands(data.landOnSale)
        
      }

      address && getAllLandSale()

    }, [address])



  return (
    <div>
        {testLands ? testLands.map(shape => {
            return shape ?

            <div>
                Shape ID: {shape.land_id}
                <button type="button" onClick={(e) => {
                    router.push({
                        pathname: "/three",
                        query: {
                            landId: shape.land_id,
                            sellerAddress: shape.address,
                            askPrice: shape.price
                        }
                    })
                }}>Buy shape</button>
            </div>

        : null})
        : null}


    </div>
  )
}

export default pagetwo