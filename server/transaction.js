const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  asset_serial: {
    type: String,
    required: true
  },
  transaction_type: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  recipient: {
    type: String
  },
  parent_hash: {
    type: String
  }
})

module.exports = mongoose.model('Transaction', transactionSchema)
