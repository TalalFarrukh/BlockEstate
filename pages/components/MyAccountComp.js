import { useEffect, useState } from "react"

const MyAccountComp = ({ address, refreshStatus, setRefreshStatus, userDetails }) => {

    const updateUser = async (e) => {
        e.preventDefault()

        const firstName = e.target.firstName.value
        const lastName = e.target.lastName.value
        const email = e.target.email.value
        const contact = e.target.contact.value

        const response = await fetch("api/updateUserDetails", {
            method: "POST",
            body: JSON.stringify({ address, firstName, lastName, email, contact }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        if(!data) return
        else setRefreshStatus(!refreshStatus)

    }

  return (
    <div className="flex flex-col">

        <div className="items-center">
            <h1 className="md:text-3xl text-sm text-center font-bold md:m-4 m-2">My Account</h1>
            <div className="flex-1 bg-gray-600 h-px"></div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-center">

            <div className="rounded-lg shadow-lg p-5 md:w-2/5 m-5 text-black border-solid border-2 border-slate-700" style={{wordWrap: 'break-word'}}>

                <h2 className="text-xl text-center font-bold mb-4">Update Account Details</h2>

                <form onSubmit={updateUser}>

                    <div className="mb-4">
                      <label className="block text-black font-bold mb-2" htmlFor="address">
                        Address
                      </label>
                      <input
                        className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 disabled:bg-gray-200 leading-tight focus:outline-none focus:shadow-outline border-solid border-2 border-slate-700"
                        type="text" name="address" placeholder="Address" required readOnly disabled defaultValue={userDetails.address}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-black font-bold mb-2" htmlFor="cnic">
                        CNIC
                      </label>
                      <input
                        className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 disabled:bg-gray-200 leading-tight focus:outline-none focus:shadow-outline border-solid border-2 border-slate-700"
                        type="text" name="cnic" placeholder="CNIC" required readOnly disabled defaultValue={userDetails.cnic}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-black font-bold mb-2" htmlFor="firstName">
                        First Name
                      </label>
                      <input
                        className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-solid border-2 border-slate-700"
                        type="text" name="firstName" placeholder="First Name" defaultValue={userDetails.firstName}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-black font-bold mb-2" htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-solid border-2 border-slate-700"
                        type="text" name="lastName" placeholder="Last Name" defaultValue={userDetails.lastName}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-black font-bold mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-solid border-2 border-slate-700"
                        type="text" name="email" placeholder="Email" defaultValue={userDetails.email}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-black font-bold mb-2" htmlFor="contact">
                        Contact
                      </label>
                      <input
                        className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-solid border-2 border-slate-700"
                        type="text" name="contact" placeholder="Contact" defaultValue={userDetails.contact}
                      />
                    </div>

                    <div className="flex items-center justify-center mt-6">
                      <button className="bg-yellow-600 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Submit
                      </button>
                    </div>


                </form>

            </div>

        </div>

    </div>
  )
}

export default MyAccountComp