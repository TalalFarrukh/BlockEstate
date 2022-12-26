const UserController = artifacts.require("UserController")
const UserStorage = artifacts.require("UserStorage")

module.exports = async (deployer) => {
  await deployer.deploy(UserStorage)
  const userStorage = await UserStorage.deployed()

  await deployer.deploy(UserController, userStorage.address)
  const userController = await UserController.deployed()

  await userStorage.setControllerAddress(userController.address)
}



// const UserStorage = artifacts.require('UserStorage')

// module.exports = (deployer) => {
//   deployer.deploy(UserStorage)
// }