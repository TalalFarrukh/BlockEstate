import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "../utils/load-contract"

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Home from "../components/Home"

import bcryptjs from "bcryptjs"

const apiSalt = bcryptjs.genSaltSync(10)
const apiKey = bcryptjs.hashSync("APIs", apiSalt)

const Dashboard = () => {

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

  const [userLands, setUserLands] = useState([])
  const [otherUserLands, setOtherUserLands] = useState([])

  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
    landToken: null
  })

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
    const getAllUserTokens = async () => {

      if(!address) return

      const { landToken, web3 } = web3Api
      
      const eventTokenIds = await landToken.getPastEvents('Transfer', {
        filter: {
          'to': address
        },
        fromBlock: 0,
        toBlock: 'latest'
      })

      const eventOtherTokenIds = await landToken.getPastEvents('Transfer', {
        filter: {
          'from': '0x0000000000000000000000000000000000000000'
        },
        fromBlock: 0,
        toBlock: 'latest'
      })

      const eventFilterOtherTokenIds = eventOtherTokenIds.filter(event => {
        return event.event === 'Transfer' && event.returnValues.to.toLowerCase() !== address.toLowerCase()
      })

      const otherLands = []
      const otherPromises = []
      const lands = []
      const promises = []
      
      eventTokenIds.forEach((tokenId) => {
        promises.push(
          landToken.tokenURI(parseInt(tokenId.returnValues.tokenId))
            .then((landTokenURI) => {
              lands.push(JSON.parse(landTokenURI))
            })
        )
      })

      Promise.all(promises)
        .then(() => {
          setUserLands(lands)
        })

      eventFilterOtherTokenIds.forEach((tokenId) => {
        otherPromises.push(
          landToken.tokenURI(parseInt(tokenId.returnValues.tokenId))
            .then((landTokenURI) => {
              otherLands.push(JSON.parse(landTokenURI))
            })
        )
      })

      Promise.all(otherPromises)
        .then(() => {
          setOtherUserLands(otherLands)
        })

        console.log(eventFilterOtherTokenIds)

    }

    web3Api.web3 && getAllUserTokens()

  }, [web3Api.web3 && address])

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
          else {
            setSessionDetails(data)

            const userResponse = await fetch("api/getUserDetails", {
              method: "POST",
              body: JSON.stringify({ address, apiKey }),
              headers: {
                'Content-Type': 'application/json'
              }
            })
            
            const userData = await userResponse.json()
            
            setUserDetails(userData)

          } 
          
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
              <Home userLands={userLands} otherUserLands={otherUserLands} address={address} />
            </div>
          </div>
        </>
      : 
        <div>Error not logged in</div>
      }

    </div>
  )
}

export default Dashboard
