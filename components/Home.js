import { useState, useEffect } from "react"

import dynamic from "next/dynamic"
const HomeMap = dynamic(() => import("./Map"), { ssr:false })

const Home = ({ address, web3Api, apiKey }) => {

    const [userLands, setUserLands] = useState([])
    const [otherUserLands, setOtherUserLands] = useState([])

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
    
        }
    
        web3Api.web3 && getAllUserTokens()
    
    }, [web3Api.web3 && address])


  return (
    
    <div className="flex flex-col">

        <div className="items-center">
            <h1 className="md:text-3xl text-xl text-center font-bold md:m-4 m-2 break-words">Welcome {address}!</h1>
            <div className="flex-1 bg-gray-600 h-px"></div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start">

            <div className="bg-gray-700 rounded-lg shadow-lg p-1.5 md:w-3/5 md:ml-5 md:mt-7 m-5" style={{wordWrap: 'break-word'}}>
                <HomeMap userLands={userLands} otherUserLands={otherUserLands} />
            </div>

            <div className="flex flex-col justify-between md:w-2/5 md:mt-7 m-5">
                <div className="bg-gray-700 rounded-lg shadow-lg p-4 mb-5 text-white">
                {/* Card Content */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id erat ac risus ullamcorper congue. Nulla id erat ac risus ullamcorper congue.</div>
                <div className="bg-gray-700 rounded-lg shadow-lg p-4 mb-5 text-white">
                {/* Card Content */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id erat ac risus ullamcorper congue. Nulla id erat ac risus ullamcorper congue.</div>
                <div className="bg-gray-700 rounded-lg shadow-lg p-4 mb-5 text-white">
                {/* Card Content */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id erat ac risus ullamcorper congue. Nulla id erat ac risus ullamcorper congue.</div>
            </div>

        </div>

        <div className="flex flex-col md:flex-row m-5">
            <div className="flex-1 p-4 text-center bg-gray-700 rounded-lg shadow-lg md:mr-3 mb-3 md:mb-0">
                <h2 className="text-xl font-bold mb-4 text-white">GIS</h2>
                <p className="text-white">A geographic information system consists of integrated computer hardware and software that store, manage, analyze, edit, output, and visualize geographic data.</p>
            </div>
            <div className="flex-1 p-4 text-center bg-gray-700 rounded-lg shadow-lg md:ml-3">
                <h2 className="text-xl font-bold mb-4 text-white">Blockchain</h2>
                <p className="text-white">A blockchain is a type of distributed database or ledger which means the power to update a blockchain is distributed between the nodes, or participants, of a public or private computer network.</p>
            </div>
        </div>


    </div>
  )
}

export default Home