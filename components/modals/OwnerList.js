import { useState } from "react"

const OwnerList = ({ sharedOwnerList, onClose, onSubmit }) => {

    const [counter, setCounter] = useState(1)

    const handleAddressRemove = (e, removeAddress) => {
        onSubmit(removeAddress)
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center md:pt-80 pt-20" style={{ zIndex:"9999" }}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-xs md:max-w-2xl">
                <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Owner List</h2>
                    <button className="focus:outline-none" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-6 h-6">
                            <path fillRule="evenodd" d="M11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 8.586 5.707 4.293a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 001.414 1.414L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    #
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Address
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {sharedOwnerList ? sharedOwnerList.map(shared => {
                                                return shared ?

                                                <tr>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap text-black">
                                                        {counter}
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap text-black">
                                                        {shared}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                        <button onClick={e => handleAddressRemove(e, shared)} className="text-red-600 hover:text-red-900">
                                                            Remove
                                                        </button>
                                                    </td>
                                                    
                                                </tr>
                                                
                                            :null}) :null}
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OwnerList