import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "./utils/load-contract"
import dynamic from "next/dynamic"

const HomeMap = dynamic(() => import("./Map"), { ssr:false })

const pagethree = () => {

    const [address, setAddress] = useState("0x34e9ae971ce73aa51cf44656559265cae4655ab6")

    const [web3Api, setWeb3Api] = useState({
      web3: null,
      provider: null,
      landToken: null
    })

    const [userLands, setUserLands] = useState([])

    const [otherUserLands, setOtherUserLands] = useState([])

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
          return event.event === 'Transfer' && event.returnValues.to.toLowerCase() !== address
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

    }, [web3Api.web3])

    const [landSaleStatus, setLandSaleStatus] = useState({});

    useEffect(() => {
      const fetchLandSaleStatus = async () => {
        const landSaleStatusArr = await Promise.all(userLands.map(userLand => checkLandSale(userLand.land_id)))
        const newLandSaleStatus = {}
        for (let i = 0; i < landSaleStatusArr.length; i++) {
          const userLand = userLands[i]
          const landSaleStatus = landSaleStatusArr[i]
          newLandSaleStatus[userLand.land_id] = landSaleStatus
        }
        setLandSaleStatus(newLandSaleStatus)
      }

      fetchLandSaleStatus()
    }, [userLands])

    const checkLandSale = async (landId) => {
      const response = await fetch("api/checkLandSale", {
        method: "POST",
        body: JSON.stringify({ landId, address }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      const data = await response.json()
      
      return data.status
    }

    const setLandSale = async (landId, cnic, status) => {
      const response = await fetch("api/setLandSale", {
        method: "POST",
        body: JSON.stringify({ landId, address, cnic, status }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      const data = await response.json()

      console.log(data.message)
    }

    return (
      <div>

        <HomeMap userLands={userLands} otherUserLands={otherUserLands} />

        {
          userLands.map(userLand => {
            const isLandOnSale = landSaleStatus[userLand.land_id]
            
            return userLand ?
            <>
              <div>Land ID: {userLand.land_id}</div>
              <div>Name: {userLand.properties.name}</div>
              <div>Type: {userLand.properties.type}</div>
              {
                !isLandOnSale ? (
                <>
                  <button onClick={() => setLandSale(userLand.land_id, "90403-0145166-1", "On Sale")}>Sell Land</button>
                </>
                ) : ( 
                <>
                  <div>{userLand.properties.name} is on sale</div>
                  <button onClick={() => setLandSale(userLand.land_id, "90403-0145166-1", "Off Sale")}>No Sell Land</button>
                </>
              )}
            </>
          : null})
        }

      </div>
    )
}

export default pagethree