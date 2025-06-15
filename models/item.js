const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
  },
  description: {
    type: String
  },
  start_price: { 
    type: Number,
    required: true
  },
  reserve_price: { 
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Item', itemSchema);