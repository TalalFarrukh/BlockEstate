import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "./utils/load-contract"


import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import MyPropertiesComp from "./components/MyPropertiesComp"

const MyProperties = () => {

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

    const [userLands, setUserLands] = useState([])

    const [isLogout, setIsLogout] = useState(false)

    const [web3Api, setWeb3Api] = useState({
        web3: null,
        provider: null,
        landToken: null
    })

    const logout = async () => {

        const session_id = sessionDetails.sessionID

        const response = await fetch("api/logout", {
            method: "POST",
            body: JSON.stringify({ address, session_id }),
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
            query: {
                logoutStatus: true
            }
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
                body: JSON.stringify({ address }),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              
              const data = await response.json()
              setSessionDetails(data)
              
            }
          }
        }
    
        web3Api.web3 && getSessionDetails()
    
      }, [web3Api.web3, address])


      useEffect(() => {
        const getAllUserTokens = async () => {
          const { landToken, web3 } = web3Api
          
          const eventTokenIds = await landToken.getPastEvents('Transfer', {
            filter: {
              'to': address
            },
            fromBlock: 0,
            toBlock: 'latest'
          })
    
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
        
        }
    
        web3Api.web3 && getAllUserTokens()
    
      }, [web3Api.web3])
    
    
      useEffect(() => {
        function handleBeforeUnload(event) {
          logout()
          event.preventDefault()
          event.returnValue = ''
        }
    
        window.addEventListener('beforeunload', handleBeforeUnload)
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload)
        }
      }, [])
    
      useEffect(() => {
        ethereum.on("accountsChanged", (accounts) => {
          if(!accounts.length) {
            logout()
          }
        })  
      })

  return (
    <div>
      {sessionDetails.token ?
        <>
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} logout={logout} />

          <div className="md:flex">
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
            <Sidebar />
            </div>

            <div className="w-full">
              <MyPropertiesComp userLands={userLands} address={address} />
            </div>
          </div>

        </>
      :
        <div>Error not logged in</div>
      }


    </div>
  )
}

export default MyProperties