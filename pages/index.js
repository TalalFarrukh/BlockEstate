import { useState, useEffect } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "../utils/load-contract"
import { useRouter } from "next/router"
import { FaUser, FaUserTie, FaEnvelope, FaIdCard, FaPhoneAlt } from "react-icons/fa"
import bcryptjs from "bcryptjs"

const apiSalt = bcryptjs.genSaltSync(10)
const apiKey = bcryptjs.hashSync("APIs", apiSalt)

export default function Home() {

  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
    landToken: null
  })

  const [address, setAddress] = useState(null)
  const [sessionDetails, setSessionDetails] = useState({
    sessionID: null,
    address: null,
    token: null,
    status: null
  })

  const [sessionStatus, setSessionStatus] = useState(0)
  const [isLogout, setIsLogout] = useState(false)
  const [isRegistered, setIsRegistered] = useState(null)

  const router = useRouter()

  const connectAccount = async () => {
    const accounts = await web3Api.provider.request({method: "eth_requestAccounts"})
    setAddress(accounts[0])
    setSessionStatus(1)
    setIsLogout(false)
  }

  const logout = async () => {

    const session_id = sessionDetails.sessionID

    const response = await fetch("api/logout", {
      method: "POST",
      body: JSON.stringify({ address, session_id, apiKey }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    setIsLogout(true)
    setAddress(null)
    setSessionStatus(0)
    setSessionDetails({
      sessionID: null,
      address: null,
      token: null,
      status: null
    })
  }
  
  const registerCnic = async (e) => {
    e.preventDefault()
    
    const cnic = e.target.cnic.value
    
    const response = await fetch("api/user/registerCnic", {
      method: "POST",
      body: JSON.stringify({ address, cnic, apiKey }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    setIsRegistered(data.isRegistered)
    
  }
  
  const registerOtherDetails = async (e) => {
    e.preventDefault()

    const firstName = e.target.firstName.value
    const lastName = e.target.lastName.value
    const email = e.target.email.value
    const contact = e.target.contact.value

    const response = await fetch("api/user/registerDetails", {
      method: "POST",
      body: JSON.stringify({ address, firstName, lastName, email, contact, apiKey }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    setIsRegistered(data.isRegistered)

    if(isRegistered === "2") {
      router.push({
        pathname: "Dashboard",
        query: {
          address
        }
      })
    }

  }

  useEffect(() => {
    ethereum.on("accountsChanged", (accounts) => {
      if(!accounts.length) {
        logout()
      }
    })  
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

  useEffect(() => {
    router.prefetch('Dashboard')
  }, [router])

  useEffect(() => {
    const getSessionDetails = async () => {
      if(isLogout) return
      if(!await web3Api.web3.eth.getAccounts()) return 
      else {
        if(!address) {
          const accounts = await web3Api.web3.eth.getAccounts()
          setAddress(accounts[0])
        }

        if(address) {
          const response = await fetch("api/login", {
            method: "POST",
            body: JSON.stringify({ address, sessionStatus, apiKey }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          const data = await response.json()

          if(!data) return
          else setSessionDetails(data)

          const registerResponse = await fetch("api/user/registered", {
            method: "POST",
            body: JSON.stringify({ address, apiKey }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          const registerData = await registerResponse.json()
          setIsRegistered(registerData.isRegistered)

          if(isRegistered === "2") {
            router.push({
              pathname: "Dashboard"
            })
          }
          
        }
      }
    }

    web3Api.web3 && getSessionDetails()

  }, [web3Api.web3, address])
  
  return (
    <div className="flex flex-col h-screen items-center justify-center py-2 bg-slate-900">
      <main className="flex w-full flex-1 flex-col items-center justify-center text-center px-2">
        <div className="flex md:flex-row flex-col bg-slate-800 rounded-2xl shadow-2xl w-full md:w-2/3 max-w-4xl">
          <div className="w-full md:w-3/5 p-1 md:p-5">
            <div className="text-left font-bold ml-2 md:ml-0 mt-2 md:mt-0">
              <span className="text-yellow-600">Block</span><span className="text-white">Estate</span>
            </div>

            <div className="flex flex-col justify-center items-center h-56 md:h-96 mb-4 md:mb-0">
              {sessionDetails.token ?
                <div>
                  {!isRegistered ?
                    <>
                      <h2 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2">
                        Register Your CNIC
                      </h2>
                      <div className="border-2 w-10 border-white inline-block mb-3"></div>
                      <form onSubmit={registerCnic} className="flex flex-col items-center">
                        <div className="bg-gray-100 w-52 p-1 md:p-2 flex items-center mb-3 rounded-lg">
                          <FaIdCard className="text-gray-500 m-2" />
                          <input type="text" name="cnic" placeholder="CNIC" minLength="13" maxLength="13" required className="bg-gray-100 outline-none text-sm w-full" />
                        </div>
                        <button type="submit" className="text-md md:text-lg rounded-full px-10 md:py-1 my-2 inline-block font-semibold bg-yellow-600 text-white">Submit</button>
                      </form>
                    </>
                  : isRegistered === '1' ?
                    <>
                      <h2 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 my-4">
                        Register Your Details
                      </h2>
                      <div className="border-2 w-10 border-white inline-block mb-3"></div>
                      <form onSubmit={registerOtherDetails} className="flex flex-col items-center">

                        <div className="flex md:block flex-wrap md:flex-nowrap justify-between">
                          <div className="bg-gray-100 w-40 md:w-64 p-1 md:p-2 flex items-center mb-3 rounded-lg mx-1">
                            <FaUser className="text-gray-500 m-2" />
                            <input type="text" name="firstName" placeholder="First Name" required className="bg-gray-100 outline-none text-sm w-full" />
                          </div>

                          <div className="bg-gray-100 w-40 md:w-64 p-1 md:p-2 flex items-center mb-3 rounded-lg mx-1">
                            <FaUserTie className="text-gray-500 m-2" />
                            <input type="text" name="lastName" placeholder="Last Name" required className="bg-gray-100 outline-none text-sm w-full" />
                          </div>
                        </div>

                        <div className="flex md:block flex-wrap md:flex-nowrap justify-between">
                          <div className="bg-gray-100 w-40 md:w-64 p-1 md:p-2 flex items-center mb-3 rounded-lg mx-1">
                            <FaEnvelope className="text-gray-500 m-2" />
                            <input type="text" name="email" placeholder="Email" required className="bg-gray-100 outline-none text-sm w-full" />
                          </div>

                          <div className="bg-gray-100 w-40 md:w-64 p-1 md:p-2 flex items-center mb-3 rounded-lg mx-1">
                            <FaPhoneAlt className="text-gray-500 m-2" />
                            <input type="text" name="contact" placeholder="Contact Number" required className="bg-gray-100 outline-none text-sm w-full" />
                          </div>
                        </div>

                        <button type="submit" className="text-md md:text-lg rounded-full px-10 py-1 my-2 inline-block font-semibold bg-yellow-600 text-white">Submit</button>
                      </form>
                    </>
                  : isRegistered === '2' ?
                    <div role="status">
                      <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                      </svg>
                    </div>
                  : null
                  }
                </div>
              :
                <>
                  <h2 className="text-xl md:text-3xl font-bold text-white mb-2">
                    Connect To Your Wallet
                  </h2>
                  <button className="text-md md:text-lg rounded-full px-10 md:py-1 my-2 inline-block font-semibold bg-yellow-600 text-white" onClick={connectAccount}>Connect</button>
                </>
              }
              
            </div>
          </div>

          <div className="w-full md:w-2/5 bg-yellow-600 text-white rounded-tr-2xl rounded-2xl p-3 md:p-5 flex flex-col justify-center items-center">
            <h1 className="text-lg md:text-xl mb-1 md:mb-3 font-bold">Your Property Tokenized</h1>
            <div className="border-2 w-10 border-white inline-block mb-3"></div>
            <p className="font-bold">
            {sessionDetails.token ? 
              <>
                Welcome <div className="break-all">{address}</div>
                <button onClick={logout} className="text-md md:text-lg rounded-full px-10 md:py-1 mt-2 md:mt-5 inline-block font-semibold bg-slate-800 text-white">Logout</button>
              </>
            :
              <>The power of buying and selling property in your hands. No third party agents, very low commissions</>
            }
              
            </p>
          </div> 
        </div>

      </main>
    </div>
  )
}
