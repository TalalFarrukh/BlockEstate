import { useState, useEffect } from "react"
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "./utils/load-contract"
import { useRouter } from "next/router"
import { FaRegEnvelope } from "react-icons/fa"
import { stringify } from 'circular-json'

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

  const [isLogout, setIsLogout] = useState(false)
  const [isRegistered, setIsRegistered] = useState(null)

  const router = useRouter()

  const connectAccount = async () => {
    const accounts = await web3Api.provider.request({method: "eth_requestAccounts"})
    setAddress(accounts[0])
    setIsLogout(false)
  }

  const logout = async () => {

    const session_id = sessionDetails.sessionID

    const response = await fetch("api/logout", {
      method: "POST",
      body: JSON.stringify({ address, session_id }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    setIsLogout(true)
    setAddress(null)
    setSessionDetails({
      sessionID: null,
      address: null,
      token: null,
      status: null
    })
  }

  useEffect(() => {
    function handleBeforeUnload(event) {
      logout()
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
  
  const registerCnic = async (e) => {
    e.preventDefault()
    
    const cnic = e.target.cnic.value
    
    const response = await fetch("api/registerCnic", {
      method: "POST",
      body: JSON.stringify({ address, cnic }),
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

    const response = await fetch("api/registerDetails", {
      method: "POST",
      body: JSON.stringify({ address, firstName, lastName, email, contact}),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    setIsRegistered(data.isRegistered)

    if(isRegistered === "2") {
      router.push({
        pathname: "pagetwo",
        query: {
          web3: web3Api.web3,
          provider: web3Api.provider,
          landToken: web3Api.landToken,
          address
        }
      })
    }

  }

  useEffect(() => {
    ethereum.on("accountsChanged", (accounts) => {
      if(!accounts.length) {
        setAddress(null)
        setSessionDetails({
          sessionID: null,
          address: null,
          token: null,
          status: null
        })
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
            body: JSON.stringify({ address }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          const data = await response.json()
          setSessionDetails(data)

          const registerResponse = await fetch("api/registered", {
            method: "POST",
            body: JSON.stringify({ address }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          const registerData = await registerResponse.json()
          setIsRegistered(registerData.isRegistered)

          if(isRegistered === "2") {
            router.push({
              pathname: "pagetwo",
              query: {
                address
              }
            })
          }
          
        }
      }
    }

    web3Api.web3 && getSessionDetails()

  }, [web3Api.web3, address])
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-slate-900">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <div className="bg-slate-800 rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div className="w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-yellow-600">Block</span><span className="text-white">Estate</span>
            </div>

            <div className="py-10">
              {sessionDetails.token ?
                <>
                  {!isRegistered ?
                    <>
                      <h2 className="text-3xl font-bold text-white mb-2 my-14">
                        Register Your CNIC
                      </h2>
                      <div className="border-2 w-10 border-white inline-block mb-3"></div>
                      <form onSubmit={registerCnic} className="flex flex-col items-center">
                        <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                          <FaRegEnvelope className="text-gray-500 m-2"/>
                          <input type="text" name="cnic" placeholder="CNIC" minLength="13" maxLength="13" required className="bg-gray-100 outline-none text-sm" />
                        </div>
                        <button type="submit" className="text-lg rounded-full px-10 py-1 my-4 inline-block font-semibold bg-yellow-600 text-white">Submit</button>
                      </form>
                    </>
                  : isRegistered === '1' ?
                    <>
                      <h2 className="text-3xl font-bold text-white mb-2 my-4">
                        Register Your Details
                      </h2>
                      <div className="border-2 w-10 border-white inline-block mb-3"></div>
                      <form onSubmit={registerOtherDetails} className="flex flex-col items-center">
                        <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                          <FaRegEnvelope className="text-gray-500 m-2"/>
                          <input type="text" name="firstName" placeholder="First Name" required className="bg-gray-100 outline-none text-sm" />
                        </div>
                        <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                          <FaRegEnvelope className="text-gray-500 m-2"/>
                          <input type="text" name="lastName" placeholder="Last Name" required className="bg-gray-100 outline-none text-sm" />
                        </div>
                        <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                          <FaRegEnvelope className="text-gray-500 m-2"/>
                          <input type="text" name="email" placeholder="Email" required className="bg-gray-100 outline-none text-sm" />
                        </div>
                        <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                          <FaRegEnvelope className="text-gray-500 m-2"/>
                          <input type="text" name="contact" placeholder="Contact Number" required className="bg-gray-100 outline-none text-sm" />
                        </div>
                        <button type="submit" className="text-lg rounded-full px-10 py-1 my-4 inline-block font-semibold bg-yellow-600 text-white">Submit</button>
                      </form>
                    </>
                  : isRegistered === '2' ?
                    <div>Details Registered</div>
                  : null
                  }
                </>
              :
                <>
                  <h2 className="text-3xl font-bold text-white mb-2 my-20">
                    Connect To Your Wallet
                  </h2>
                  <button className="text-lg rounded-full px-10 py-1 my-4 inline-block font-semibold bg-yellow-600 text-white" onClick={connectAccount}>Connect</button>
                </>
              }
              
            </div>
          </div>

          <div className="w-2/5 bg-yellow-600 text-white flex-row rounded-tr-2xl rounded-br-2xl py-36 px-12">
            <h1 className="mb-3 text-xl font-bold">Your Property Tokenized</h1>
            <div className="border-2 w-10 border-white inline-block mb-3"></div>
            <p className="mb-10 font-bold">
            {sessionDetails.token ? 
              <>
                Welcome <div className="break-all">{address}</div>
                <button onClick={logout} className="text-lg rounded-full px-10 py-1 mt-5 inline-block font-semibold bg-slate-800 text-white">Logout</button>
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
