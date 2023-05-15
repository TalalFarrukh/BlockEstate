import { useState, useEffect } from "react"
import { decrypt } from "utils/crypt"
import generatePDF from "utils/load-document"
import { Bounce, Flip, toast, ToastContainer, Zoom } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Tesseract from "tesseract.js"

const TransactionComp = ({ address, web3Api, userDetails, router, apiKey }) => {

    const date = new Date().toLocaleDateString()

    const [refreshStatus, setRefreshStatus] = useState(false)

    const [transactionId, setTransactionId] = useState()
    const [transaction, setTransaction] = useState({})

    const [seller, setSeller] = useState({})
    const [buyer, setBuyer] = useState({})

   const [userStatus, setUserStatus] = useState("")

   const [loader, setLoader] = useState(false)
   const [paymentConfirm, setPaymentConfirm] = useState(false)

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

        if(transaction.seller_payment_id === transaction.buyer_payment_id) {
            const { landToken } = web3Api

            const documentData = {
                tokenId: transaction.land_id,
                buyer: buyer,
                seller: seller,
                transaction: transaction,
                date: date
            }
    
            const documentDataJSON = JSON.stringify(documentData)
    
            const landTransferContract = await landToken.transferAgreementDocument(documentData.tokenId, documentData.buyer.address, documentData.seller.address, documentDataJSON, {from:address})
    
            if(landTransferContract) {
                toast.success("Transfer complete!", {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        }
        else {
            toast.error("Payments do not match", {
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

    const [image, setImage] = useState(null)
    const [text, setText] = useState(null)

    useEffect(() => {

        const doOCR = async () => {
            if (!image) return
            const result = await Tesseract.recognize(image)
            setText(result.data.lines[4].text)
        }
        doOCR()

    }, [image])

    useEffect(() => {

        const doRegex = async () => {
            const regex = /\d+/g
            const numbers = text.match(regex)
            const paymentID = numbers.length>1 ? numbers[1] : numbers[0]
            
            let id = transaction.id
                
            const response = await fetch("api/transaction/uploadPaymentID", {
                method: "POST",
                body: JSON.stringify({ id, paymentID, userStatus, apiKey }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()
            if(!data) return

            toast.success(data.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            })

            setLoader(false)
            setPaymentConfirm(true)
            setRefreshStatus(!refreshStatus)
        }

        text && doRegex()

    }, [text])

    const handleImageChange = (event) => {
        setLoader(true)
        setImage(URL.createObjectURL(event.target.files[0]))
    }

  return (
    <div className="flex flex-col">

        <div className="items-center">
            <h1 className="md:text-3xl text-xl text-center font-bold md:m-4 m-2">Transaction</h1>
            <div className="flex-1 bg-gray-600 h-px"></div>
        </div>

        <div className="md:flex flex-wrap justify-between md:p-5 p-2">

            {transaction && transaction.is_status === "2" ?
                <>
                    {userStatus && userStatus === "Seller" ?
                        <div className="flex flex-col justify-center mx-auto rounded-lg shadow-lg p-5 text-black border-solid border-2 border-slate-700">
                            
                            {transaction.is_buyer_paid === "1" && transaction.buyer_payment_id ?
                                <>
                                    <div className="text-center mb-5">
                                        <h2 className="text-sm md:text-xl font-bold">Buyer has made the payment. Please upload your receipt and confirm the payment</h2>
                                    </div>

                                    <div className="mx-auto flex flex-wrap justify-center">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="image-upload">
                                            Upload Receipt
                                        </label>
                                        <input className="appearance-none border-2 border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" id="image-upload" type="file" onChange={handleImageChange} accept="image/*" />

                                        {loader ?
                                            <div role="status" className="m-2">
                                                <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                </svg>
                                            </div>
                                        : null}

                                        {!paymentConfirm ?
                                            <button onClick={confirmPayment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline">
                                                Confirm Payment
                                            </button>
                                        : null}
                                        
                                    </div>
                                </>
                            :
                                <div className="text-center mb-5">
                                    <h2 className="text-sm md:text-xl font-bold">Wait for the Buyer to transfer you money</h2>
                                </div>
                            }            
                            
                        </div>

                    : userStatus === "Buyer" ?
                    
                        <div className="flex flex-col justify-center mx-auto rounded-lg shadow-lg p-5 text-black border-solid border-2 border-slate-700">
                                
                            {transaction.is_buyer_paid === "1" && transaction.buyer_payment_id ?
                                <div className="text-center mb-5">
                                    <h2 className="text-sm md:text-xl font-bold">Please wait for the Seller to upload their receipt</h2>
                                </div>
                            :
                                <>
                                    <div className="text-center mb-5">
                                        <h2 class="text-sm md:text-xl font-bold">Please transfer the money to the Seller and then confirm it</h2>
                                    </div>

                                    <div className="mx-auto flex flex-wrap justify-center">
                                        
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="image-upload">
                                            Upload Receipt
                                        </label>
                                        <input className="appearance-none border-2 border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" id="image-upload" type="file" onChange={handleImageChange} accept="image/*" />
                                        
                                        {loader ?
                                            <div role="status" className="m-2">
                                                <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                </svg>
                                            </div>
                                        : null}

                                        {!paymentConfirm ?
                                            <button onClick={payPayment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline">
                                                Confirm Payment
                                            </button>
                                        : null}
                                    </div>
                                </>
                                
                            }            
                            
                        </div>
                    : null}
                </>
            : transaction.is_status === "1" ?
                <>
                    {userStatus && userStatus === "Seller" ?
                        <div className="flex flex-col justify-center mx-auto rounded-lg shadow-lg p-5 text-black border-solid border-2 border-slate-700">
                            <div className="text-center mb-5">
                                <h2 className="text-sm md:text-xl font-bold">Buyer Address: {transaction.buyer_address}</h2>
                            </div>
                            
                            <div className="mx-auto mb-5">
                                <img className="w-12 md:w-24 h-12 md:h-24" src="https://via.placeholder.com/150" alt="square" />
                            </div>
                            <div className="mx-auto flex flex-wrap justify-center">
                                <button onClick={e => generatePDF(seller, buyer, transaction, date, "Not Save")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
                                    View PDF
                                </button>

                                {transaction.is_seller_signed !== "1" ?
                                    <button onClick={signDocument} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline">
                                        Sign Document
                                    </button>
                                : null}
                            </div>
                        </div>

                    : userStatus === "Buyer" ?
                    
                        <div className="flex flex-col justify-center mx-auto rounded-lg shadow-lg p-5 text-black border-solid border-2 border-slate-700">
                            <div className="text-center mb-5">
                                <h2 className="text-sm md:text-xl font-bold">Seller Address: {transaction.seller_address}</h2>
                            </div>
                            
                            <div className="mx-auto mb-5">
                                <img className="w-12 md:w-24 h-12 md:h-24" src="https://via.placeholder.com/150" alt="square" />
                            </div>
                            <div className="mx-auto flex flex-wrap justify-center">
                                <button onClick={e => generatePDF(seller, buyer, transaction, date, "Not Save")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
                                    View PDF
                                </button>

                                {transaction.is_buyer_signed !== "1" ?
                                    <button onClick={signDocument} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline">
                                        Sign Document
                                    </button>
                                : null}
                            </div>
                        </div>
                    : null}
                </>
            : 
                <>
                    {userStatus && userStatus === "Seller" ?
                        <div className="flex flex-col justify-center mx-auto rounded-lg shadow-lg p-5 text-black border-solid border-2 border-slate-700">
                            <div className="text-center mb-5">
                                <h2 className="text-sm md:text-xl font-bold">Buyer Address: {transaction.buyer_address}</h2>
                            </div>
                            
                            <div className="mx-auto mb-5">
                                <img className="w-12 md:w-24 h-12 md:h-24" src="https://via.placeholder.com/150" alt="square" />
                            </div>
                            <div className="mx-auto flex flex-wrap justify-center">
                                <button onClick={e => generatePDF(seller, buyer, transaction, date, "Save")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline">
                                    View Final PDF
                                </button>
                            </div>
                        </div>

                    : userStatus === "Buyer" ?
                    
                        <div className="flex flex-col justify-center mx-auto rounded-lg shadow-lg p-5 text-black border-solid border-2 border-slate-700">
                            <div className="text-center mb-5">
                                <h2 className="text-sm md:text-xl font-bold">Seller Address: {transaction.seller_address}</h2>
                            </div>
                            
                            <div className="mx-auto mb-5">
                                <img className="w-12 md:w-24 h-12 md:h-24" src="https://via.placeholder.com/150" alt="square" />
                            </div>
                            <div className="mx-auto flex flex-wrap justify-center">
                                <button onClick={e => generatePDF(seller, buyer, transaction, date, "Save")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline">
                                    View Final PDF
                                </button>
                            </div>
                        </div>
                    : null}
                </>
            }

        </div>

        <ToastContainer limit={1} autoClose={1800} hideProgressBar={true} pauseOnFocusLoss={false} theme="colored" transition={Flip} closeOnClick={false} />
        
    </div>
  )
}

export default TransactionComp