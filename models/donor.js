const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({
  name: String,
  foodItem: String,
  quantity: String,
  address: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Donor", DonorSchema);
