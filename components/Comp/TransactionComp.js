import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { decrypt } from "utils/crypt"
import generatePDF from "utils/load-document"
import { Bounce, Flip, toast, ToastContainer, Zoom } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const TransactionComp = ({ address, web3Api, userDetails, router, apiKey }) => {

    const date = new Date().toLocaleDateString()

    const [refreshStatus, setRefreshStatus] = useState(false)

    const [transactionId, setTransactionId] = useState()
    const [transaction, setTransaction] = useState({})

    const [seller, setSeller] = useState({})
    const [buyer, setBuyer] = useState({})

   const [userStatus, setUserStatus] = useState("")

    useEffect(() => {
        if(!router.isReady) return
        setTransactionId(decrypt(router.query.id))
    }, [router.isReady])

    useEffect(() => {

        const transactionDetails = async () => {

            const response = await fetch("api/transaction/getTransactionById", {
                method: "POST",
                body: JSON.stringify({ transactionId, apiKey }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()

            if(!data) return
            
            setTransaction(data.transaction)
            
        }

        transactionId && address && transactionDetails()

    }, [transactionId && address, refreshStatus])

    useEffect(() => {

        const setBuyerSeller = async () => {
            if(transaction.seller_address === address.toLowerCase()) {
                setUserStatus("Seller")
                setSeller(userDetails)
    
                let address = transaction.buyer_address
    
                const userResponse = await fetch("api/user/getUserDetails", {
                    method: "POST",
                    body: JSON.stringify({ address, apiKey }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                
                const userData = await userResponse.json()
                if(!userData) return
                setBuyer(userData)
            } 
            else if(transaction.buyer_address === address.toLowerCase()) {
                setUserStatus("Buyer")
                setBuyer(userDetails)
    
                let address = transaction.seller_address
    
                const userResponse = await fetch("api/user/getUserDetails", {
                    method: "POST",
                    body: JSON.stringify({ address, apiKey }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                
                const userData = await userResponse.json()
                if(!userData) return
                setSeller(userData)
            } 
        }

        transaction && setBuyerSeller()

        
    }, [transaction.id])

    const signDocument = async () => {
        
        const response = await fetch("api/transaction/signDocument", {
            method: "POST",
            body: JSON.stringify({ transactionId, userStatus, apiKey }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        const data = await response.json()

        if(!data) return

        toast.success(data.message, {
            position: toast.POSITION.BOTTOM_RIGHT
        })

        setRefreshStatus(!refreshStatus)

    }

    const confirmPayment = async () => {

        let landId = transaction.land_id
        let sellerAddress = transaction.seller_address
        let buyerAddress = transaction.buyer_address
        let acceptedPrice = transaction.accepted_price
    
        let bidStatus = "3"

        const updateBid = await fetch("api/transaction/updateBidStatus", {
            method: "POST",
            body: JSON.stringify({ landId, sellerAddress, buyerAddress, acceptedPrice, bidStatus, apiKey }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const updateData = await updateBid.json()
        if(!updateData) return

        const { landToken } = web3Api

        const documentData = {
            tokenId: transaction.land_id,
            buyer: transaction.buyer_address,
            seller: transaction.seller_address,
            price: transaction.accepted_price,
            date: date
        }

        const documentDataJSON = JSON.stringify(documentData)

        const landTransferContract = await landToken.transferAgreementDocument(documentData.tokenId, documentData.buyer, documentData.seller, documentDataJSON, {from:address})

        if(landTransferContract) {
            toast.success("Transfer complete!", {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }

    }

    const payPayment = async () => {

        let id = transaction.id

        const payPayment = await fetch("api/transaction/payPayment", {
            method: "POST",
            body: JSON.stringify({ id, apiKey }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const paymentData = await payPayment.json()
        if(!paymentData) return

        toast.success(paymentData.message, {
            position: toast.POSITION.BOTTOM_RIGHT
        })

        setRefreshStatus(!refreshStatus)
        
    }

  return (
    <div className="flex flex-col">

        <div className="items-center">
            <h1 className="md:text-3xl text-xl text-center font-bold md:m-4 m-2">Transaction</h1>
            <div className="flex-1 bg-gray-600 h-px"></div>
        </div>

        <div className="md:flex flex-wrap justify-between md:p-5 p-2">

            {transaction ? transaction.is_status === "2" ?
                <>
                    {userStatus && userStatus === "Seller" ?
                        <div class="flex flex-col justify-center mx-auto rounded-lg shadow-lg p-5 text-black border-solid border-2 border-slate-700">
                            
                            {transaction.is_buyer_paid === "1" ?
                                <>
                                    <div className="text-center mb-5">
                                        <h2 class="text-sm md:text-xl font-bold">Buyer has made the payment. Please confirm it</h2>
                                    </div>

                                    <div className="mx-auto flex flex-wrap justify-center">
                                        <button onClick={confirmPayment} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline">
                                            Confirm Payment
                                        </button>
                                    </div>
                                </>
                            :
                                <div className="text-center mb-5">
                                    <h2 class="text-sm md:text-xl font-bold">Wait for the Buyer to transfer you money</h2>
                                </div>
                            }            
                            
                        </div>

                    : userStatus === "Buyer" ?
                    
                        <div class="flex flex-col justify-center mx-auto rounded-lg shadow-lg p-5 text-black border-solid border-2 border-slate-700">
                                
                            {transaction.is_buyer_paid === "1" ?
                                <div className="text-center mb-5">
                                    <h2 class="text-sm md:text-xl font-bold">Please wait for the Seller to confirm the payment</h2>
                                </div>
                            :
                                <>
                                    <div className="text-center mb-5">
                                        <h2 class="text-sm md:text-xl font-bold">Please transfer the money to the Seller and then confirm it</h2>
                                    </div>

                                    <div className="mx-auto flex flex-wrap justify-center">
                                        <button onClick={payPayment} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline">
                                            Confirm Payment
                                        </button>
                                    </div>
                                </>
                                
                            }            
                            
                        </div>
                    : null}
                </>
            :
                <>
                    {userStatus && userStatus === "Seller" ?
                        <div class="flex flex-col justify-center mx-auto rounded-lg shadow-lg p-5 text-black border-solid border-2 border-slate-700">
                            <div className="text-center mb-5">
                                <h2 class="text-sm md:text-xl font-bold">Buyer Address: {transaction.buyer_address}</h2>
                            </div>
                            
                            <div className="mx-auto mb-5">
                                <img className="w-12 md:w-24 h-12 md:h-24" src="https://via.placeholder.com/150" alt="square" />
                            </div>
                            <div className="mx-auto flex flex-wrap justify-center">
                                <button onClick={e => generatePDF(seller, buyer, transaction, date)} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
                                    View PDF
                                </button>
                                <button onClick={signDocument} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Sign Document
                                </button>
                            </div>
                        </div>

                    : userStatus === "Buyer" ?
                    
                        <div class="flex flex-col justify-center mx-auto rounded-lg shadow-lg p-5 text-black border-solid border-2 border-slate-700">
                            <div className="text-center mb-5">
                                <h2 class="text-sm md:text-xl font-bold">Seller Address: {transaction.seller_address}</h2>
                            </div>
                            
                            <div className="mx-auto mb-5">
                                <img className="w-12 md:w-24 h-12 md:h-24" src="https://via.placeholder.com/150" alt="square" />
                            </div>
                            <div className="mx-auto flex flex-wrap justify-center">
                                <button onClick={e => generatePDF(seller, buyer, transaction, date)} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
                                    View PDF
                                </button>
                                <button onClick={signDocument} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Sign Document
                                </button>
                            </div>
                        </div>
                    : null}
                </>
            : null}

        </div>

        <ToastContainer limit={1} autoClose={1800} hideProgressBar={true} pauseOnFocusLoss={false} theme="colored" transition={Flip} closeOnClick={false} />
        
    </div>
  )
}

export default TransactionComp