import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "../utils/load-contract"
import { decrypt } from "../utils/crypt"

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import BuyLandComp from "../components/BuyLandComp"

import bcryptjs from "bcryptjs"

const apiSalt = bcryptjs.genSaltSync(10)
const apiKey = bcryptjs.hashSync("APIs", apiSalt)

const BuyLand = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const [refreshStatus, setRefreshStatus] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const router = useRouter()

    const [address, setAddress] = useState(null)
    const [sessionDetails, setSessionDetails] = useState({
        sessionID: null,
        address: null,
        token: null,
        status: null
    })
    const [userDetails, setUserDetails] = useState({
        address: null,
        cnic: null,
        firstName: null,
        lastName: null,
        email: null,
        contact: null,
        isRegistered: null
    })

    const [sessionStatus, setSessionStatus] = useState(0)
    const [isLogout, setIsLogout] = useState(false)

    const [web3Api, setWeb3Api] = useState({
        web3: null,
        provider: null,
        landToken: null
    })

    const [isSubmitted, setIsSubmitted] = useState(false)

    const [landId, setLandId] = useState(null)
    const [sellerAddress, setSellerAddress] = useState(null)
    const [askPrice, setAskPrice] = useState(null)

    const [bidPrice, setBidPrice] = useState(null)

    const [land, setLand] = useState({})

    useEffect(() => {
        if(!router.isReady) return
        setLandId(decrypt(router.query.landId))
        setSellerAddress(decrypt(router.query.sellerAddress))
        setAskPrice(decrypt(router.query.askPrice))
    }, [router.isReady])

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
        setSessionStatus(0)
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
              setSessionDetails(data)
    
              const userResponse = await fetch("api/getUserDetails", {
                method: "POST",
                body: JSON.stringify({ address, apiKey }),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              
              const userData = await userResponse.json()
              
              if(!userData) return
              setUserDetails(userData)
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

        const getLand = async () => {
            const { landToken, web3 } = web3Api

            const tokenURI = await landToken.tokenURI(parseInt(landId))
            const parseLand = await JSON.parse(tokenURI)

            setLand(parseLand)
        }

        web3Api.web3 && landId && getLand()

    }, [web3Api.web3 && landId])


    useEffect(() => {
        const checkSubmitBid = async () => {
          const response = await fetch("api/checkSubmitBid", {
            method: "POST",
            body: JSON.stringify({ landId, address, apiKey }),
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
        else setRefreshStatus(!refreshStatus)
  
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
        else setRefreshStatus(!refreshStatus)

    }


  return (
    <div>
      {sessionDetails.token && userDetails.isRegistered === "2" ?
        <>
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} logout={logout} />

          <div className="md:flex">
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
                <Sidebar />
            </div>

            <div className="w-full">
                <BuyLandComp land={land} />
            </div>
          </div>

        </>
      :
        <div>Error not logged in</div>
      }

    </div>
  )
}

export default BuyLand