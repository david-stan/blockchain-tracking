# Blockchain tracking example

## Introduction
This app is example of a arbitrary supply chain management system, relying on Ethereum blockchain. Since it is just a proof of concept, Ethereum is quite sufficient technology to use. Hyperledger Fabric would be a much better technology to implement, since this particular use-case naturally runs on private blockchain networks. Nevertheless, it is a nice example for other developers interested in this area.

### Server
Server side in this example is quite optional, because MetaMask API on client-side is quite capable on itself of sending and getting transactions from Ethereum blockchain. NodeJS server is just used for filtering and sorting existing transactions, where in case of thousands of transactions, it would be very impractical to do these operations on client-side due to performance issues.
If used, mongodb database would need to be installed: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/, since it is used in this example.

### Client
Client app is meant to be the main application, where the connection with the blockchain is set. This is possible because of MetaMask extension, which must be installed in order to use the app: https://metamask.io/. MetaMask provider, if visible in browser, would be included in React app on mounting operation (getWeb3.js module).

### Truffle 
Truffle is used for smart contract compilation and deployment to Ethereum network, in this particular case, the Ropsten test network. Truffle HDWallet Provider is used on the server side for contract signing, since MetaMask already implements signing on the client app.
