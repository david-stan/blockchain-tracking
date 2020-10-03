import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

class CreateAssets extends Component {
  state = { web3: null, contract: null, serial_number: '', description: '' }

  componentDidMount = async () => {
    const { web3, contract } = this.props;
    this.setState({ web3, contract });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { web3, contract } = this.state;
    const accounts = await web3.eth.getAccounts();
    try {
      const receipt = await contract.methods
        .createAsset(this.state.serial_number, (new Date()).getTime(), this.state.description, "")
        .send({ from: accounts[0] })
      const transaction = {
        asset_serial: receipt.events.AssetCreated.returnValues.serial_number,
        transaction_type: "TR_CREATE",
        timestamp: receipt.events.AssetCreated.returnValues.creation_date,
        owner: receipt.events.AssetCreated.returnValues.manufacturer,
        description: receipt.events.AssetCreated.returnValues.description,
        parent_serial: receipt.events.AssetCreated.returnValues.parent_serial,
      }
      axios
        .post('http://localhost:3000/transactions', transaction)
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
            Create
          </Button>
        </Form.Group>
      </Form>
    );
  }
}

export default CreateAssets;
