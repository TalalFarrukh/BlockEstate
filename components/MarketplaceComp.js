import LandSaleCard from "./cards/LandSaleCard"

const MarketplaceComp = ({ landSale }) => {
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