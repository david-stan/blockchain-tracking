import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SimpleStorageContract from "./contracts/AssetTracker.json";
import getWeb3 from "./getWeb3";
import axios from 'axios';

import "./App.css";
import Header from "./components/Header";
import ViewTransactions from "./components/ViewTransactions";
import TransferAssets from "./components/TransferAssets";
import CreateAssets from "./components/CreateAssets";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, receipt_values: null, transfer_to: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      //console.log(accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handlePi = async () => {

  }



  runExample = async () => {
    const { accounts, contract } = this.state;

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    contract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest'
    })
    .then(function(events){
        events.forEach(async (event) => {
          //console.log(event);
          //console.log("--------");
        })
    });

    // Update state with the result.
    // this.setState({ storageValue: response });
  };

  render() {
    const { web3, contract } = this.state;
    if (!web3) {
      return (<div>Loading Web3, accounts, and contract...</div>);
    }
    return (
      <Router>
        <div className="App">
          <Header />

          <Route exact path="/" component={ViewTransactions} />
          <Route path="/transfer" render={
            (props) => <TransferAssets {...props} web3={web3} contract={contract}/>
          }/>
          <Route path="/create" render={
            (props) => <CreateAssets {...props} web3={web3} contract={contract}/>
          }/>
        </div>
      </Router>
    );
  }
}

export default App;
