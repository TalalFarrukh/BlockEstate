import { useState, useEffect } from "react"

import LandSaleCard from "./cards/LandSaleCard"

const MarketplaceComp = ({ address, web3Api, apiKey }) => {

  const [landSale, setLandSale] = useState([])

  useEffect(() => {
      const getAllLandSale = async () => {

        if(!address) return

        const { landToken, web3 } = web3Api

        const response = await fetch("api/landSale/getAllLandSale", {
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
    <div className="flex flex-col">
        <div className="items-center">
            <h1 className="md:text-3xl text-xl text-center font-bold md:m-4 m-2">Marketplace</h1>
            <div className="flex-1 bg-gray-600 h-px"></div>
        </div>

        <div className="md:flex flex-wrap justify-between md:p-5 p-2">
            {landSale ? landSale.map(land => {return land ?
                <LandSaleCard land={land} />
            : null})
            : null}
        </div>
    </div>
  )
}

export default MarketplaceComp