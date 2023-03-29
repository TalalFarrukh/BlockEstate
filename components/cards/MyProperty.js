import { useEffect, useState } from "react"
import { Bounce, Flip, toast, ToastContainer, Zoom } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import AddOwner from "../modals/AddOwner"

import dynamic from "next/dynamic"
const MyMap = dynamic(() => import("../MyMap"), { ssr:false })

import bcryptjs from "bcryptjs"

const apiSalt = bcryptjs.genSaltSync(10)
const apiKey = bcryptjs.hashSync("APIs", apiSalt)

const MyProperty = ({ userLand, address, landToken, cnic }) => {

    const [refreshStatus, setRefreshStatus] = useState(false)
    const [landSaleStatus, setLandSaleStatus] = useState()

    const [isEditingPrice, setIsEditingPrice] = useState(false)
    const [price, setPrice] = useState(0)

    const checkLandSale = async (landId) => {
        const response = await fetch("api/checkLandSale", {
            method: "POST",
            body: JSON.stringify({ landId, address, apiKey }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()

        if(data.status) setPrice(data.price)

        return data.status
    }

    const setLandSale = async (landId, status) => {

        const landAddress = userLand.properties.name
        const type = userLand.properties.type
        const area = userLand.properties.area

        const response = await fetch("api/setLandSale", {
            method: "POST",
            body: JSON.stringify({ landId, address, cnic, status, landAddress, type, area, price, apiKey }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()

        toast.success(data.message, {
            position: toast.POSITION.BOTTOM_RIGHT
        })

        setRefreshStatus(!refreshStatus)
    }

    useEffect(() => {

        const fetchLandSaleStatus = async () => {
            const landSaleStatusPromise = await checkLandSale(userLand.land_id)
            setLandSaleStatus(landSaleStatusPromise)
          }
    
          fetchLandSaleStatus()

    }, [refreshStatus])

    const handlePriceDoubleClick = () => {
        setIsEditingPrice(true)
    }

    const handlePriceBlur = () => {
        setIsEditingPrice(false)
    }

    const handlePriceChange = (event) => {
        setPrice(event.target.value)
    }

    const handlePriceKeyPress = (event) => {
        if (event.key === "Enter") {
            setIsEditingPrice(false)
        }
    }


    const [showModal, setShowModal] = useState(false)
    const [newSharedAddress, setNewSharedAddress] = useState("")

    const handleShowModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleSubmitModal = async (sharedAddress) => {
        setNewSharedAddress(sharedAddress)
        
        const setOwner = await landToken.setSharedOwners(address, [newSharedAddress], userLand.land_id, {from:address})

        if(setOwner) {
            setShowModal(false)
            toast.success("Owner added", {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }

    }

  return (
    <div className="max-w-xl md:w-3/6 m-3 rounded-md overflow-hidden shadow-lg bg-gradient-to-r from-gray-800 via-slate-600 to-gray-600 text-white border-4 border-black">
        
        <MyMap userLand={userLand} />
        
        <div className="p-4">
            <h2 className="font-semibold text-xl mb-2 ml-2.5">{userLand.properties.name.toUpperCase()}</h2>

            <ul className="mb-4 ml-2.5">
                <li>Address: {userLand.properties.name}</li>
                <li>Type: {userLand.properties.type}</li>
                <li>Area: 10,000 sq. ft.</li>
                
                {isEditingPrice ? (
                    <li>
                        <label className="mr-2">
                            Price:
                        </label>
                        <input type="number" value={price} onChange={handlePriceChange} onBlur={handlePriceBlur} onKeyPress={handlePriceKeyPress} className="bg-gray-500 text-white w-24 p-1" autoFocus />
                        <label className="ml-2">
                            PKR
                        </label>
                    </li>
                )
                :
                (
                    <li onDoubleClick={handlePriceDoubleClick}>
                        Price: {price} PKR
                    </li>
                )}
                
            </ul>

            <div className="flex justify-between">
                {!landSaleStatus ? 
                    <button onClick={() => setLandSale(userLand.land_id, "On Sale")} className="bg-red-500 hover:bg-red-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-2/4 m-2">
                        Sell
                    </button>
                :
                    <button onClick={() => setLandSale(userLand.land_id, "Off Sale")} className="bg-green-500 hover:bg-green-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-2/4 m-2">
                        On Sale
                    </button>
                }

                <button onClick={handleShowModal} className="bg-yellow-600 hover:bg-yellow-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-2/4 m-2">
                    Add Owners
                </button>

                {showModal &&
                    <AddOwner onClose={handleCloseModal} onSubmit={handleSubmitModal} />
                }
            </div>

        </div>
        
        <ToastContainer limit={1} autoClose={1800} hideProgressBar={true} pauseOnFocusLoss={false} theme="colored" transition={Flip} closeOnClick={false} />
    </div>
  )
}

export default MyProperty