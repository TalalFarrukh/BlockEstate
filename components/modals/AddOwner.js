import { useState } from "react"

const AddOwner = ({ onClose, onSubmit, setNewSharedAddress }) => {

    const [sharedAddress, setSharedAddress] = useState("")

    const handleAddressSubmit = (e) => {
        onSubmit(sharedAddress)
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center md:pt-80 pt-20" style={{ zIndex:"9999" }}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-bold">Add Owner</h2>
                <button className="focus:outline-none" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-6 h-6">
                        <path fillRule="evenodd" d="M11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 8.586 5.707 4.293a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 001.414 1.414L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                        Address
                    </label>
                    <input onChange={e => setSharedAddress(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Enter address" />
                </div>

                <div className="flex justify-center">
                    <button onClick={handleAddressSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                        Add
                    </button>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default AddOwner