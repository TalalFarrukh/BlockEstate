import { useEffect, useState } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "./utils/load-contract"


const pagefour = () => {

    const [address, setAddress] = useState("0x294a60E096abbb9c77178a55A059E2f58d8409B7")

    const [web3Api, setWeb3Api] = useState({
        web3: null,
        provider: null,
        landToken: null
    })

    const [saleLands, setSaleLands] = useState([])

    useEffect(() => {
        const loadProvider = async () => {
            const provider = await detectEthereumProvider()
            const landToken = await loadContract("LandToken", provider)
            
            if(provider) {
            setWeb3Api({
                web3: new Web3(provider),
                provider,
                landToken
            })
            }
        }
        loadProvider()
    }, [])

    useEffect(() => {

        const getAllLandSale = async () => {
            const response = await fetch("api/getAllLandSale", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                }
            })
    
            const data = await response.json()

            const landsOnSale = data.landOnSale.filter(land => {
                return land.address !== address
            })

            setSaleLands(landsOnSale)
    
            console.log(saleLands)
        }

        web3Api.web3 && getAllLandSale()

    }, [web3Api.web3])

    return (
        <>
            {
                saleLands.map(land => {
                    return land ?
                    <>
                        <div>Land ID: {land.land_id}</div>
                        <div>User Address: {land.address}</div>
                        <div>User CNIC: {land.usercnic}</div>
                        <button>Buy Land</button>
                    </>
                :
                null})
            }



        </>
    )
}

export default pagefour