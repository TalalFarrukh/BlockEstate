import { useState, useEffect } from "react"
import MyProperty from "../cards/MyProperty"

const MyPropertiesComp = ({ address, web3Api, userDetails, apiKey }) => {

  const [userLands, setUserLands] = useState([])

  useEffect(() => {
    const getAllUserTokens = async () => {
      const { landToken, web3 } = web3Api
      
      const eventTokenIds = await landToken.getPastEvents('Transfer', {
        filter: {
          'to': address,
        },
        fromBlock: 0,
        toBlock: 'latest'
      })

      const notOwnedTokenIds = await landToken.getPastEvents('Transfer', {
        filter: {
          'from': address,
        },
        fromBlock: 0,
        toBlock: 'latest'
      })

      const commonTokenIds = eventTokenIds.filter((event) => {
        return !notOwnedTokenIds.some((notOwned) => notOwned.returnValues.tokenId === event.returnValues.tokenId);
      })      

      const lands = []
      const promises = []

      commonTokenIds.forEach((tokenId) => {
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

  }, [web3Api.web3 && address])

  return (
    <div className="flex flex-col">

        <div className="items-center">
            <h1 className="md:text-3xl text-xl text-center font-bold md:m-4 m-2">My Properties</h1>
            <div className="flex-1 bg-gray-600 h-px"></div>
        </div>

        <div className="md:flex flex-wrap justify-between md:p-5 p-2">

          {userLands ? userLands.map(userLand => {return userLand ?
              <MyProperty userLand={userLand} address={address} landToken={web3Api.landToken} cnic={userDetails.cnic} apiKey={apiKey} />
          : null})
          : null}
            
        </div>

    </div>
  )
}

export default MyPropertiesComp