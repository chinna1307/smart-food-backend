const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  name: String,
  food: String,
  people: Number,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Request", RequestSchema);
