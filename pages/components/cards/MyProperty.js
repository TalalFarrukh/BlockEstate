import { useEffect, useState } from "react"
import MyMap from "../MyMap"


const MyProperty = ({ userLand, address }) => {

    const [refreshStatus, setRefreshStatus] = useState(false)
    const [landSaleStatus, setLandSaleStatus] = useState()

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

        setRefreshStatus(!refreshStatus)
    }

    useEffect(() => {

        const fetchLandSaleStatus = async () => {
            const landSaleStatusPromise = await checkLandSale(userLand.land_id)
            setLandSaleStatus(landSaleStatusPromise)
          }
    
          fetchLandSaleStatus()

    }, [refreshStatus])


  return (
    <div className="max-w-xl md:w-3/6 m-3 rounded-md overflow-hidden shadow-lg bg-gray-700 text-white">
        <MyMap userLand={userLand} />
        <div className="p-4">
            <h2 className="font-semibold text-xl mb-2 ml-2.5">{userLand.properties.name.toUpperCase()}</h2>
            <ul className="mb-4 ml-2.5">
                <li>Address: {userLand.properties.name}</li>
                <li>Type: {userLand.properties.type}</li>
                <li>Area: 10,000 sq. ft.</li>
            </ul>
            <div className="flex justify-between">

                {!landSaleStatus ? 
                    <button onClick={() => setLandSale(userLand.land_id, "90403-0145166-1", "On Sale")} className="bg-red-500 hover:bg-red-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-2/4 m-2">
                        Sell
                    </button>
                :
                    <button onClick={() => setLandSale(userLand.land_id, "90403-0145166-1", "Off Sale")} className="bg-green-500 hover:bg-green-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-2/4 m-2">
                        On Sale
                    </button>
                }

                <button className="bg-yellow-600 hover:bg-yellow-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-2/4 m-2" type="button">
                    Add Owners
                </button>
            </div>
        </div>
    </div>
  )
}

export default MyProperty