const mongoose = require('mongoose');


const stockSchema = new mongoose.Schema({
  symbol: { type: String, unique: true },
  open: Number,
  close: Number,
  high: Number,
  low: Number,
  volume: Number,
  updatedAt: Date
});


const stock = new mongoose.model('Stock', stockSchema);
module.exports = stock
