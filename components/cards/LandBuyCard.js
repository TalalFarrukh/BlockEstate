import dynamic from "next/dynamic"
const MyMap = dynamic(() => import("../MyMap"), { ssr:false })

const LandBuyCard = ({ land, sellerAddress, askPrice }) => {
    
    return (
        <div className="max-w-xl md:w-1/2 m-3 rounded-md overflow-hidden shadow-lg bg-gradient-to-r from-gray-800 via-slate-600 to-gray-600 text-white border-4 border-black">
            <MyMap userLand={land} />
    
            <div className="p-4">
                <h2 className="font-semibold text-xl mb-2 ml-2.5">{land.properties.name.toUpperCase()}</h2>
    
                <ul className="mb-2 ml-2.5">
                    <li>
                        Address: {land.properties.name}
                    </li>
                    <li>
                        Type: {land.properties.type}
                    </li>
                    <li>
                        Seller Address: {sellerAddress}
                    </li>
                    <li>
                        Seller Ask Price: {askPrice}
                    </li>
                </ul>
    
            </div>
    
        </div>
      )
}

export default LandBuyCard