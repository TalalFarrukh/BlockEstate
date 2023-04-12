import { useState } from "react"
import { FaFolder, FaIdCard } from "react-icons/fa"
import { Bounce, Flip, toast, ToastContainer, Zoom } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const VerifyLandComp = ({ address, web3Api, userDetails, apiKey }) => {

  const [landExists, setLandExists] = useState(false)
  const [landExistsId, setLandExistsId] = useState(null)
  const [land, setLand] = useState(null)
  const [landTokenExists, setLandTokenExists] = useState(false)

  const checkLandExists = async (e) => {
    e.preventDefault()

    const landId = parseInt(e.target.landId.value)
    const cnic = e.target.cnic.value

    const response = await fetch("api/checkLandExists", {
      method: "POST",
      body: JSON.stringify({ landId, cnic, apiKey }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if(!data) return
    if(data.status) {

      toast.success(data.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      })

      setLandExists(data.status)
      setLandExistsId(landId)
      setLand(data.landJson)
    }
    else {
      toast.error(data.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    }

  }

  const mintToken = async (e) => {
    e.preventDefault()

    const { landToken } = web3Api.landToken
    
    const landJsonString = JSON.stringify(land)
    const landTokenContract = await landToken.safeMint(address, landExistsId, landJsonString, {from:address})

    if(landTokenContract) {
      toast.success("Token generated!", {
        position: toast.POSITION.BOTTOM_RIGHT
      })
      
      setLandTokenExists(true)
    }
    
  }

  const verifyNewLand = async (e) => {
    e.preventDefault()

    setLandExists(false)
    setLandExistsId(null)
    setLand(null)
    setLandTokenExists(false)
  }


  return (
    <div className="flex flex-col">

        <div className="items-center">
            <h1 className="md:text-3xl text-xl text-center font-bold md:m-4 m-2">Verify your land and generate your token!</h1>
            <div className="flex-1 bg-gray-600 h-px"></div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-center">
            <div className="bg-gray-700 rounded-lg shadow-lg p-5 md:w-3/5 md:mt-10 m-5 text-white" style={{wordWrap: 'break-word'}}>

              {!landExists && !landTokenExists ?
                <>
                  <h2 className="text-xl text-center font-bold mb-4">Enter Land Details</h2>

                  <form onSubmit={checkLandExists}>

                    <div className="mb-4">
                      
                      <label className="flex text-white font-bold mb-2" htmlFor="landId">
                        <FaFolder className="text-white text-xl mt-0.5 mr-2" /> Land ID 
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text" name="landId" placeholder="Land ID" required 
                      />
                    </div>

                    <div className="mb-4">
                      <label className="flex text-white font-bold mb-2" htmlFor="cnic">
                        <FaIdCard className="text-white text-xl mt-0.5 mr-2" /> CNIC
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 disabled:bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                        type="text" name="cnic" placeholder="CNIC" minLength="13" maxLength="13" required readOnly disabled defaultValue={userDetails.cnic}
                      />
                    </div>

                    <div className="flex items-center justify-center mt-6">
                      <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Submit
                      </button>
                    </div>

                  </form>
                </>
              : landExists && !landTokenExists ?
                <>
                  <h2 className="text-xl text-center font-bold mb-4">Your Land Exists!</h2>

                  <div className="text-center mb-4">
                    Your land has been verified! Please generate your token
                  </div>

                  <div className="flex items-center justify-center mt-6">
                    <button onClick={mintToken} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Generate
                    </button>
                  </div>

                </>
              :
                <>
                  <h2 className="text-xl text-center font-bold mb-4">Your token has been generated!</h2>

                  <div className="text-center mb-4">
                    You may verify another land now
                  </div>

                  <div className="flex items-center justify-center mt-6">
                    <button onClick={verifyNewLand} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Verfiy new land
                    </button>
                  </div>

                </>
              }

            </div>
        </div>

        <ToastContainer limit={1} autoClose={1800} hideProgressBar={true} pauseOnFocusLoss={false} theme="colored" transition={Flip} closeOnClick={false} />

    </div>
  )
}

export default VerifyLandComp