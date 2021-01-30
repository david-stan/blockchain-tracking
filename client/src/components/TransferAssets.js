import React, { Component } from "react";
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

class TransferAssets extends Component {
  state = { web3: null, contract: null, serial_number: '', description: '' }

  componentDidMount = async () => {
    const { web3, contract } = this.props;
    this.setState({ web3, contract });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = {
        "serial_number": this.state.serial_number
      }
      //connecting with raspberryPi - not suitable for testing if there is no rPi
      //axios.post('http://169.254.152.129:8090/confirm', data)
      //  .then((response) => {
      //    console.log(response);
      //    toast.success("Serial number has been confirmed.");
            this.handleTransaction();
      //  })
      //  .catch((error) => {
      //    toast.error("Serial number has not been confirmed.");
      //  });
    } catch (e) {
      console.log('Error out', e);
    }
  }

  handleTransaction = async () => {
    const { web3, contract } = this.state;
    const accounts = await web3.eth.getAccounts();
    try {
      //send transfer transaction to blockchain
      const receipt = await contract.methods
        .changeAssetOwnership(this.state.serial_number, (new Date()).getTime(), this.state.description)
        .send({ from: accounts[0] });

      //send transaction to server
      const transaction = {
        asset_serial: receipt.events.AssetTransfered.returnValues.serial_number,
        transaction_type: "TR_TRANSFER",
        timestamp: receipt.events.AssetTransfered.returnValues.transfer_date,
        owner: receipt.events.AssetTransfered.returnValues.from,
        description: receipt.events.AssetTransfered.returnValues.description,
        recipient: receipt.events.AssetTransfered.returnValues.to
      }
      axios.post('http://localhost:3000/transactions', transaction)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
    } catch(e) {
      console.log(e)
    }
  }

  handleChangeSerial = (event) => {
    event.preventDefault();
    this.setState({serial_number: event.target.value});
  }

  handleChangeDescription = (event) => {
    event.preventDefault();
    this.setState({description: event.target.value});
  }

  render() {
    return(
      <>
      <ToastContainer/>
      <Form className="form-style" onSubmit={this.handleSubmit}>
        <Form.Group className="form-group" controlId="exampleForm.ControlInput1" onChange={this.handleChangeSerial}>
          <Form.Label>Serial Number:</Form.Label>
          <Form.Control type="text" placeholder="Serial number" />
        </Form.Group>
        <Form.Group className="form-group" controlId="exampleForm.ControlTextarea1" onChange={this.handleChangeDescription}>
          <Form.Label>Description:</Form.Label>
          <Form.Control as="textarea" rows="3" placeholder="Description" />
        </Form.Group>
        <Form.Group className="form-group" controlId="exampleForm.ControlTextarea1">
          <Button variant="primary" type="submit">
            Transfer
          </Button>
        </Form.Group>
      </Form>
      </>
    );
  }
}

export default TransferAssets;
