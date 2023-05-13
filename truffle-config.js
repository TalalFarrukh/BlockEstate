require("dotenv").config()
const HDWalletProvider = require("@truffle/hdwallet-provider")
const { INFURA_API_KEY, MNEMONIC } = process.env

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 5000,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    sepolia: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_KEY),
      network_id: "11155111",
      from: "0xE19127ec032446EB4Be355c9BD4eE3ADD839843d"
    }
  },


  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17",      // Fetch exact version from solc-bin (default: truffle's version)
    }
  },

};
