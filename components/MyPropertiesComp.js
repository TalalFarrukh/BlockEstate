import MyProperty from "./cards/MyProperty"

const MyPropertiesComp = ({ userLands, address, landToken, cnic }) => {

  return (
    <div className="flex flex-col">

        <div className="items-center">
            <h1 className="md:text-3xl text-xl text-center font-bold md:m-4 m-2">My Properties</h1>
            <div className="flex-1 bg-gray-600 h-px"></div>
        </div>

        <div className="md:flex flex-wrap justify-between md:p-5 p-2">

        {userLands ? userLands.map(userLand => {return userLand ?
            <MyProperty userLand={userLand} address={address} landToken={landToken} cnic={cnic} />
        : null})
        : null}
            

        </div>

    </div>
  )
}

export default MyPropertiesComp