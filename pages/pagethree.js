import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "./utils/load-contract"

const pagethree = () => {

    const [address, setAddress] = useState(null)

    const [web3Api, setWeb3Api] = useState({
        web3: null,
        provider: null,
        landToken: null
    })

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

    return (
        <div>pagethree</div>
    )
}

export default pagethree