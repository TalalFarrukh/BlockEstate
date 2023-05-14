import { useState, useEffect } from "react"
import generatePDF from "utils/load-document"

const HistoryComp = ({ address, web3Api, router, apiKey }) => {

    const [soldHistoryLand, setSoldHistoryLand] = useState([])

    const [boughtHistoryLand, setBoughtHistoryLand] = useState([])

    useEffect(() => {

        const getBoughtTransactionHistory = async () => {

            const { landToken } = web3Api

            const transferredTokenIds = await landToken.getPastEvents('Transfer', {
                filter: {
                  'to': address,
                },
                fromBlock: 3477148,
                toBlock: 'latest'
            })

            const transferredLands = []
            const promises = []

            transferredTokenIds.forEach((tokenId) => {
                if(tokenId.returnValues.from !== "0x0000000000000000000000000000000000000000") {
                    promises.push(
                        landToken.retrieveTransferDocument(parseInt(tokenId.returnValues.tokenId), tokenId.returnValues.to, tokenId.returnValues.from)
                            .then((document) => {
                                transferredLands.push(JSON.parse(document))
                            })
                    )
                }
            })

            Promise.all(promises)
                .then(() => {
                    setBoughtHistoryLand(transferredLands)
                })
        }

        web3Api.web3 && getBoughtTransactionHistory()

    }, [web3Api.web3 && address])

    useEffect(() => {

        const getSoldTransactionHistory = async () => {

            const { landToken } = web3Api

            const transferredTokenIds = await landToken.getPastEvents('Transfer', {
                filter: {
                  'from': address,
                },
                fromBlock: 3477148,
                toBlock: 'latest'
            })

            const transferredLands = []
            const promises = []
            
            transferredTokenIds.forEach((tokenId) => {
                promises.push(
                    landToken.retrieveTransferDocument(parseInt(tokenId.returnValues.tokenId), tokenId.returnValues.to, tokenId.returnValues.from)
                        .then((document) => {
                            transferredLands.push(JSON.parse(document))
                        })
                )
            })

            Promise.all(promises)
                .then(() => {
                    setSoldHistoryLand(transferredLands)
                })
        }

        web3Api.web3 && getSoldTransactionHistory()

    }, [web3Api.web3 && address])


  return (
    <div className="flex flex-col">

        <div className="items-center">
            <h1 className="md:text-3xl text-xl text-center font-bold md:m-4 m-2">Transaction History</h1>
            <div className="flex-1 bg-gray-600 h-px"></div>
        </div>

        <h1 className="md:text-xl text-lg text-left font-bold md:m-5 m-2 md:mb-0 mb-0">Buy History</h1>

        <div className="md:flex flex-wrap justify-between md:p-4 p-1">
            {boughtHistoryLand.length>0 ? boughtHistoryLand.map(buyHistory => {return buyHistory ?
                <div className="flex flex-col justify-between max-w-xl md:w-2/4 m-4">
                    <div className="bg-gray-700 rounded-lg shadow-lg text-white">
                        <div className="w-2/5/5 p-3 md:text-lg text-sm text-center">
                            <div className="mb-2">Seller: {buyHistory.seller.address}</div>
                            <div className="mb-2">Price: {buyHistory.transaction.accepted_price}</div>
                            <div className="mb-4">Date: {buyHistory.date}</div>

                            <button onClick={e => generatePDF(buyHistory.seller, buyHistory.buyer, buyHistory.transaction, buyHistory.date, "Save")} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
                                View Agreement
                            </button>
                        </div>
                    </div>
                </div>
            :null}) 
            :   
                <h1 className="md:text-xl text-lg text-center md:m-4 m-2">No Buy History</h1> 
            }
        </div>

        <h1 className="md:text-xl text-lg text-left font-bold md:m-5 m-2 md:mb-0 mb-0">Sell History</h1>

        <div className="md:flex flex-wrap justify-between md:p-4 p-1">
            {soldHistoryLand.length>0 ? soldHistoryLand.map(sellHistory => {return sellHistory ?
                <div className="flex flex-col justify-between max-w-xl md:w-2/4 m-4">
                    <div className="bg-gray-700 rounded-lg shadow-lg text-white">
                        <div className="w-2/5/5 p-3 md:text-lg text-sm text-center">
                            <div className="mb-2">Buyer: {sellHistory.buyer.address}</div>
                            <div className="mb-2">Price: {sellHistory.transaction.accepted_price}</div>
                            <div className="mb-4">Date: {sellHistory.date}</div>

                            <button onClick={e => generatePDF(sellHistory.seller, sellHistory.buyer, sellHistory.transaction, sellHistory.date, "Save")} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline">
                                View Agreement
                            </button>
                        </div>
                    </div>
                </div>
            :null}) 
            :
                <h1 className="md:text-xl text-lg text-center md:m-4 m-2">No Sell History</h1>
            }
        </div>
        
    </div>
  )
}

export default HistoryComp