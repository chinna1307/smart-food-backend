const express = require("express");
const router = express.Router();
const Donor = require("../models/donor");
const match = require("../utils/aiMatch");

router.post("/", async (req, res) => {
  const donors = await Donor.find();
  const matched = match(req.body.food, donors);
  res.json(matched);
});

module.exports = router;
