import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { decrypt } from "utils/crypt"
import bcryptjs from "bcryptjs"

const apiSalt = bcryptjs.genSaltSync(10)
const apiKey = bcryptjs.hashSync("APIs", apiSalt)

const one = () => {

    const router = useRouter()

    const [address, setAddress] = useState("0x34E9aE971ce73Aa51Cf44656559265cAe4655AB6")

    const [refreshStatus, setRefreshStatus] = useState(false)

    const [transactionId, setTransactionId] = useState()
    const [transaction, setTransaction] = useState({})

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
        if(transaction.seller_address === address.toLowerCase()) setUserStatus("Seller")
        else if(transaction.buyer_address === address.toLowerCase()) setUserStatus("Buyer")
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

        setRefreshStatus(!refreshStatus)

        console.log(data.message)

    }

    

  return (
    <div>

        {transaction ? transaction.is_status === "2" ?
            <>
                <div>Yay document Signed!</div>
            </>
        :

            <>
            
                {userStatus && userStatus === "Seller" ?
                    
                    <>
                        <div>Seller: {address}</div>
                        <button onClick={signDocument}>Seller Sign</button>
                    </>
                : userStatus === "Buyer" ?
                    <>
                        <div>Buyer: {address}</div>
                        <button onClick={signDocument}>Buyer Sign</button>
                    </>
                    
                : null}
            
            </>

        : null}


        
    </div>
  )
}

export default one