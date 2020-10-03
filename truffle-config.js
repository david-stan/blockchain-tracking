const path = require("path");
var HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = "baby bubble inquiry bless token device march custom giraffe usual dwarf slice";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/62f5e71782004228a6610cf3244f72ef", address_index=0, num_addresses=10)
      },
      network_id: 3,
      gas: 4000000
    }
  }
};
