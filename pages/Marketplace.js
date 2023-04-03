import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "../utils/load-contract"

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import MarketplaceComp from "../components/MarketplaceComp"

import bcryptjs from "bcryptjs"

const apiSalt = bcryptjs.genSaltSync(10)
const apiKey = bcryptjs.hashSync("APIs", apiSalt)

const Marketplace = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

    const [landSale, setLandSale] = useState([])
    
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

      const getAllLandSale = async () => {

        if(!address) return

        const { landToken, web3 } = web3Api

        const response = await fetch("api/getAllLandSale", {
          method: "POST",
          body: JSON.stringify({ address, apiKey }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        const data = await response.json()

        if(!data) return

        const updatedLandOnSale = data.landOnSale.map(async land => {

          const tokenURI = await landToken.tokenURI(parseInt(land.land_id))
          
          return {
            ...land,
            geometry: JSON.parse(tokenURI).geometry
          }

        })

        const results = await Promise.all(updatedLandOnSale)
        setLandSale(results)
      }

      web3Api.web3 && address && getAllLandSale()


    }, [web3Api.web3 && address])


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
                <MarketplaceComp landSale={landSale} />
            </div>
          </div>

        </>
      :
        <div>Error not logged in</div>
      }


    </div>
  )
}

export default Marketplace