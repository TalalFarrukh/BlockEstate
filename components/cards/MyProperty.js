import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { encrypt } from "utils/crypt"
import { Bounce, Flip, toast, ToastContainer, Zoom } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaBars } from "react-icons/fa"

import AddOwner from "../modals/AddOwner"
import OwnerList from "../modals/OwnerList"

import dynamic from "next/dynamic"
const MyMap = dynamic(() => import("../MyMap"), { ssr:false })

const MyProperty = ({ userLand, address, landToken, cnic, apiKey }) => {

    const router = useRouter()

    const [refreshStatus, setRefreshStatus] = useState(false)
    const [landSaleStatus, setLandSaleStatus] = useState()
    const [isTransaction, setIsTransaction] = useState(false)
    const [transactionId, setTransactionId] = useState(null)

    const [isEditingPrice, setIsEditingPrice] = useState(false)
    const [price, setPrice] = useState(0)

    const checkLandSale = async (landId) => {
        const response = await fetch("api/landSale/checkLandSale", {
            method: "POST",
            body: JSON.stringify({ landId, address, apiKey }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()

        if(!data) return
        if(data.status) setPrice(data.price)

        return data.status
    }

    const setLandSale = async (landId, status) => {

        const landAddress = userLand.properties.name
        const type = userLand.properties.type
        const area = userLand.properties.area

        const response = await fetch("api/landSale/setLandSale", {
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

            let landId = userLand.land_id

            const response = await fetch("api/bid/checkLandBidStatus", {
                method: "POST",
                body: JSON.stringify({ landId, apiKey }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    
            const data = await response.json()
            
            if(data.status) {
                setTransactionId(data.id)
                setIsTransaction(data.status)
            }
            else {
                const landSaleStatusPromise = await checkLandSale(userLand.land_id)
                setLandSaleStatus(landSaleStatusPromise)
            }
            
        }
    
        fetchLandSaleStatus()

    }, [refreshStatus])

    useEffect(() => {
        const getSharedOwnerList = async () => {
            const ownerList = await landToken.sharedOwnerList(address, userLand.land_id, {from:address})
            setSharedOwnerList(ownerList)
        }
        
        getSharedOwnerList()

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


    const [showOwnerModal, setShowOwnerModal] = useState(false)

    const [showOwnerListModal, setShowOwnerListModal] = useState(false)
    const [sharedOwnerList, setSharedOwnerList] = useState([])

    const handleShowOwnerModal = () => {
        setShowOwnerModal(true)
    }
    const handleCloseOwnerModal = () => {
        setShowOwnerModal(false)
    }
    const handleSubmitOwnerModal = async (sharedAddress) => {
        
        const setOwner = await landToken.setSharedOwners(address, sharedAddress, userLand.land_id, {from:address})

        if(setOwner) {
            setShowOwnerModal(false)
            setRefreshStatus(!refreshStatus)
            toast.success("Owner added", {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }

    }

    const handleShowOwnerListModal = () => {
        setShowOwnerListModal(true)
    }
    const handleCloseOwnerListModal = () => {
        setShowOwnerListModal(false)
    }
    const handleRemoveOwnerModal = async (sharedAddress) => {
        
        const removeOwner = await landToken.deleteSharedOwners(address, sharedAddress, userLand.land_id, {from:address})

        if(removeOwner) {
            setRefreshStatus(!refreshStatus)
            toast.success("Owner removed", {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }

    }

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="max-w-xl md:w-3/6 m-3 rounded-md overflow-hidden shadow-lg bg-gradient-to-r from-gray-800 via-slate-600 to-gray-600 text-white border-4 border-black">
        
        <MyMap userLand={userLand} />
        
        <div className="p-4">
            <div className="flex justify-between">
                <div className="inline-flex">
                    <h2 className="font-semibold text-xl mb-2 ml-2.5">{userLand.properties.name.toUpperCase()}</h2>
                </div>
                <div className="relative flex justify-end">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-8 h-8 focus:outline-none">
                        <FaBars className="text-xl" />
                    </button>
                    {isDropdownOpen && (
                    <div className="absolute top-8 right-0 z-10 w-32 text-center bg-gray-800 rounded-md shadow-lg">
                        <button onClick={handleShowOwnerModal} className="block w-full rounded-md px-4 py-2 text-sm text-white hover:bg-gray-700">
                            Add Owners
                        </button>
                        {showOwnerModal &&
                            <AddOwner onClose={handleCloseOwnerModal} onSubmit={handleSubmitOwnerModal} />
                        }

                        <button onClick={handleShowOwnerListModal} className="block w-full rounded-md px-4 py-2 text-sm text-white hover:bg-gray-700">
                            Owner List
                        </button>
                        {showOwnerListModal &&
                            <OwnerList sharedOwnerList={sharedOwnerList} onClose={handleCloseOwnerListModal} onSubmit={handleRemoveOwnerModal} />
                        }

                        {landSaleStatus ?
                            <button onClick={(e) => {
                                router.push({
                                    pathname: "BidRequests",
                                    query: {
                                        landId: encrypt(userLand.land_id),
                                    }
                                })
                            }} className="block w-full rounded-md px-4 py-2 text-sm text-white hover:bg-gray-700">
                                Bid Requests
                            </button>
                        : null}
                        
                    </div>
                    )}
                </div>
            </div>

            <ul className="mb-4 ml-2.5">
                <li>Address: {userLand.properties.name}</li>
                <li>Type: {userLand.properties.type}</li>
                <li>Area: 10,000 m<sup>2</sup></li>
                
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

            <div className="flex justify-center">
                {!landSaleStatus && !isTransaction ? 
                    <button onClick={() => setLandSale(userLand.land_id, "On Sale")} className="bg-red-500 hover:bg-red-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-3/4 m-2">
                        Sell
                    </button>
                :!isTransaction ?
                    <button onClick={() => setLandSale(userLand.land_id, "Off Sale")} className="bg-green-500 hover:bg-green-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-3/4 m-2">
                        Remove
                    </button>
                :
                    <button onClick={(e) => {
                        router.push({
                            pathname: "Transaction",
                            query: {
                                id: encrypt(transactionId),
                            }
                        })
                    }} className="bg-yellow-600 hover:bg-yellow-400 text-white font-bold md:py-2 py-1 px-3 rounded focus:outline-none focus:shadow-outline w-3/4 m-2">
                        Continue Transaction
                    </button>
                }
            </div>

        </div>
        
        <ToastContainer limit={1} autoClose={1800} hideProgressBar={true} pauseOnFocusLoss={false} theme="colored" transition={Flip} closeOnClick={false} />
    </div>
  )
}

export default MyProperty