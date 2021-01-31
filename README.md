# Blockchain tracking example

## Introduction
This app is example of a arbitrary supply chain management system, relying on Ethereum blockchain. Since it is just a proof of concept, Ethereum is quite sufficient technology to use. Hyperledger Fabric would be a much better technology to implement, since this particular use-case naturally runs on private blockchain networks. Nevertheless, it is a nice example for other developers interested in this area.
Second part of this project is a RaspberryPi4 component which validates transaction based on the QRCode of the asset that we're tracking in the supply chain. Since it is unlikely for everybody that clones this repo to have RPi at this moment, i have commented out code where RPi server is asked for validation.

### Server
Server side in this example is quite optional, because MetaMask API on client-side is quite capable on itself of sending and getting transactions from Ethereum blockchain. NodeJS server is just used for filtering and sorting existing transactions, where in case of thousands of transactions, it would be very impractical to do these operations on client-side due to performance issues.
If used, mongodb database would need to be installed: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/, since it is used in this example.

### Client
Client app is meant to be the main application, where the connection with the blockchain is set. This is possible because of MetaMask extension, which must be installed in order to use the app: https://metamask.io/. MetaMask provider, if visible in browser, would be included in React app on mounting operation (getWeb3.js module).

### Truffle 
Truffle is used for smart contract compilation and deployment to Ethereum network, in this particular case, the Ropsten test network. Truffle HDWallet Provider is used on the server side for contract signing, since MetaMask already implements signing on the client app.

## Installation

### MetaMask
Simply install MetaMask browser extension from the store and sign up. It is needed by the client side in order to communicate with public Ethereum network.

### Server
After cloning the repository, go to server directory and make .env file where infura api key and mnemonic phrase should be stored. Infura api is a neat way of communicating with Ethereum without running Ethereum node on your machine: https://infura.io/. Mnemonic seed phrase is needed for authentication and you can get it from MetaMask extension in Settings>Security&Privacy. It should be in the form
```
INFURA_API=<infura_api_key> (ie. https://ropsten.infura.io/v3/<infura_api_key>)
MNEMONIC="<seed_phrase>"
```
Afterwards, you can go 
```
npm install
```
and then run server if mongodb is installed
```
npm run start-dev
```

### Client
For React application simply run 
```
npm install
```
and
```
npm run start
```

## Usage

Main entity in this use-case is the Asset. It can be created or transfered. In the main page, we can track Asset as it is transfered between different owners. Owners(Ethereum accounts) are changed in MetaMask extension and you can make arbitrary number of them and give them some fake Ether (see https://faucet.metamask.io/). If you want to transfer Asset to a different user, choose a different user in MetaMask extension and transfer it using the TransferAsset component. Optional description/comment can be added. For every creation/transfer, MetaMask extension is called, and transaction details are set. Transaction itself lasts for 10-15 seconds because Ropsten is a proof-of-work type network.

Now imagine a more complex asset with many fields/properties and not just description property. This app is very easily scalable for different use-cases.
