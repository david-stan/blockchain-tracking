const express = require('express')
const Web3 = require('web3')
const cors = require('cors')
const parser = require('body-parser')

const app = express()
app.use(cors())

require('dotenv').config()

const mongoose = require('mongoose')

const Transaction = require("./transaction")
const AssetTracker = require("./ContractAbi/AssetTracker.json");

const HDWalletProvider = require("@truffle/hdwallet-provider");

mongoose.connect('mongodb://localhost/transaction', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.once('open', async () => {

  const provider = new HDWalletProvider(process.env.MNEMONIC, `https://ropsten.infura.io/v3/${process.env.INFURA_API}`);
  const web3 = new Web3(provider);

  const networkId = await web3.eth.net.getId();
  const assetContract = new web3.eth.Contract(
    AssetTracker.abi,
    AssetTracker.networks[networkId].address
  );

  Transaction.remove({}, (error, data) => {});

  let api_data = []

  const events = await assetContract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest'
  });

  events.forEach((event) => {
    if (event.event === "AssetCreated") {
      api_data.push({
        asset_serial: event.returnValues.serial_number,
        transaction_type: "TR_CREATE",
        timestamp: event.returnValues.creation_date,
        owner: event.returnValues.manufacturer,
        description: event.returnValues.description,
        recipient: event.returnValues.recipient,
        parent_serial: event.returnValues.parent_serial
      });
    } else {
      api_data.push({
        asset_serial: event.returnValues.serial_number,
        transaction_type: "TR_TRANSFER",
        timestamp: event.returnValues.transfer_date,
        owner: event.returnValues.from,
        description: event.returnValues.description,
        recipient: event.returnValues.to
      });
    }
  });
  console.log(api_data)
  Transaction.insertMany(api_data, (err) => { console.log(err) })
})

app.get('/transactions', paginatedData(Transaction), (req, res) => {
  res.json(res.pagination_object)
})

const json_parser = parser.json();
app.post('/transactions', json_parser, async (req, res) => {
  const transaction = new Transaction({
    asset_serial: req.body.asset_serial,
    transaction_type: req.body.transaction_type,
    timestamp: req.body.timestamp,
    owner: req.body.owner,
    description: req.body.description,
    recipient: req.body.recipient,
    parent_serial: req.body.parent_serial
  });
  try {
    const newTransaction = await transaction.save();
    res.status(201).status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

function paginatedData(model) {
  return async (req, res, next) => {
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 10;
    const page = req.query.page
      ? parseInt(req.query.page)
      : 1;

    const pagination_object = {}
    const filter = req.query.regex;
    try {
        const result = await model.find({asset_serial: new RegExp(filter)})
          .skip((page - 1) * pagination)
          .limit(pagination)
          .sort({timestamp: -1});

        const test = await model.find({asset_serial: new RegExp(filter)})
        const count = test.length;

        pagination_object.previous = page == 1
          ? false
          : true;

        pagination_object.next = ((page - 1) * pagination + pagination < count)
          ? true
          : false;

        pagination_object.data = result;

        pagination_object.page = page;

        res.pagination_object = pagination_object;
        next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}

app.listen(3000)
