const LandToken = artifacts.require("LandToken")

module.exports = async (deployer) => {
  deployer.deploy(LandToken)
}