import { useState, useEffect } from "react"

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
                fromBlock: 0,
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
                fromBlock: 0,
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

    console.log(boughtHistoryLand)
    console.log(soldHistoryLand)

  return (
    <div className="flex flex-col">

        <div className="items-center">
            <h1 className="md:text-3xl text-xl text-center font-bold md:m-4 m-2">Transaction History</h1>
            <div className="flex-1 bg-gray-600 h-px"></div>
        </div>

        <div className="md:flex flex-wrap justify-between md:p-4 p-2">
            <h1 className="md:text-xl text-lg text-left font-bold md:m-4 m-2">Buy History</h1>

            

        </div>

    </div>
  )
}

export default HistoryComp