import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { encrypt } from "utils/crypt"

import dynamic from "next/dynamic"
const MyMap = dynamic(() => import("../MyMap"), { ssr:false })

const LandSaleCard = ({ land, apiKey }) => {

    const router = useRouter()

    const [userDetails, setUserDetails] = useState([])

    useEffect(() => {
        
        const getOwnerDetails = async () => {
            let address = land.address

            const userResponse = await fetch("api/user/getUserDetails", {
                method: "POST",
                body: JSON.stringify({ address, apiKey }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            const userData = await userResponse.json()
            
            if(!userData) return
            setUserDetails(userData)
        }

        getOwnerDetails()

    }, [])

  return (
    <div className="max-w-xl md:w-3/6 m-3 rounded-md overflow-hidden shadow-lg bg-gradient-to-r from-gray-800 via-slate-600 to-gray-600 text-white border-4 border-black">
        <MyMap userLand={land} />

        <div className="p-4">
            <h2 className="font-semibold text-xl mb-2 ml-2.5">{land.land_address.toUpperCase()}</h2>

            <ul className="mb-2 ml-2.5">
                <li>
                    Address: {land.land_address}
                </li>
                <li>
                    Type: {land.type}
                </li>
                <li>
                    Area: {land.area}
                </li>
                <li>
                    Price: {land.price}
                </li>
                <li>
                    Contact No: {userDetails.contact}
                </li>
            </ul>

            <div className="flex justify-center">
                <button type="button" className="bg-green-500 hover:bg-green-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-4/5 m-2"
                onClick={(e) => {
                    router.push({
                        pathname: "BuyLand",
                        query: {
                            landId: encrypt(land.land_id),
                            sellerAddress: encrypt(land.address),
                            askPrice: encrypt(land.price)
                        }
                    }, undefined, { shallow: true })
                }}>
                    Buy
                </button>
            </div>

        </div>

    </div>
  )
}

export default LandSaleCard