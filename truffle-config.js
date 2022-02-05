require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/services/blockchain/blockchains/ethereum/contracts/',
  contracts_build_directory: './src/services/blockchain/blockchains/ethereum/abis/',
  compilers: {
    solc: {
			version: "0.8.4",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
