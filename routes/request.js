const express = require("express");
const router = express.Router();
const Request = require("../models/request");
const Donor = require("../models/donor");
const match = require("../utils/aiMatch");
const sendMail = require("../utils/email");

router.post("/", async (req, res) => {
  try {
    const request =
