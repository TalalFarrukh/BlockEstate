import dynamic from "next/dynamic"
const MyMap = dynamic(() => import("../MyMap"), { ssr:false })

const LandBuyCard = () => {
    return (
        <div className="max-w-xl md:w-3/6 m-3 rounded-md overflow-hidden shadow-lg bg-gradient-to-r from-gray-800 via-slate-600 to-gray-600 text-white border-4 border-black">
            <MyMap userLand={land} />
    
            <div className="p-4">
                <h2 className="font-semibold text-xl mb-2 ml-2.5"></h2>
    
                <ul className="mb-2 ml-2.5">
                    <li>
                        Address: 
                    </li>
                    <li>
                        Type: 
                    </li>
                    <li>
                        Area: 
                    </li>
                    <li>
                        Price: 
                    </li>
                </ul>
    
                <div className="flex justify-center">
                    <button type="button" className="bg-green-500 hover:bg-green-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-4/5 m-2">
                    
                    </button>
                </div>
    
            </div>
    
        </div>
      )
}

export default LandBuyCard