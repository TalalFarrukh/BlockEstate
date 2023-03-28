import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "./utils/load-contract"

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

    const [otherUserLands, setOtherUserLands] = useState([])

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
                body: JSON.stringify({ address, sessionStatus }),
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
        const getAllUserTokens = async () => {
          const { landToken, web3 } = web3Api
    
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
            
            
        }
    
        web3Api.web3 && getAllUserTokens()
    
      }, [web3Api.web3 && address])


    useEffect(() => {
        ethereum.on("accountsChanged", (accounts) => {
          if(!accounts.length) {
            logout()
          }
        })  
      })

    


  return (
    <div>
        {otherUserLands ? otherUserLands.map(shape => {
            return shape ?

            <div>
                Shape ID: {shape.properties.land_id}
                <button type="button" onClick={(e) => {
                    router.push({
                        pathname: "/three",
                        query: {
                            landId: shape.properties.land_id,
                            sellerAddress: "0x34e9ae971ce73aa51cf44656559265cae4655ab6",
                            askPrice: 100000
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