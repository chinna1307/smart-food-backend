const express = require("express");
const router = express.Router();
const Donor = require("../models/donor");

router.post("/", async (req, res) => {
  const donor = new Donor(req.body);
  await donor.save();
  res.json({ success: true, donor });
});

router.get("/", async (req, res) => {
  const donors = await Donor.find();
  res.json(donors);
});

module.exports = router;
