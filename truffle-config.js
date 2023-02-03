module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
<<<<<<< HEAD
      port: 9545,            // Standard Ethereum port (default: none)
=======
      port: 7545,            // Standard Ethereum port (default: none)
>>>>>>> 9d69eed4fd708a80406660e369b74c0675690626
      network_id: "*",       // Any network (default: none)
    }
  },


  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17",      // Fetch exact version from solc-bin (default: truffle's version)
    }
  },

};
