require("dotenv").config(); // 1. Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());

/* ---------- MongoDB Connection ---------- */
// 2. Connect using the URI from your .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

/* ---------- Database Schema ---------- */
// Define how a Food Request looks in the database
const RequestSchema = new mongoose.Schema({
  name: String,
  address: String,
  food: String,
  people: Number,
  createdAt: { type: Date, default: Date.now }
});

const Request = mongoose.model("Request", RequestSchema);

// Define how a Donation looks
const DonationSchema = new mongoose.Schema({
  donorName: String,
  foodDetails: String,
  quantity: String,
  createdAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model("Donation", DonationSchema);

/* ---------- Root Test Route ---------- */
app.get("/", (req, res) => {
  res.send("🚀 Smart Food Backend is Live and Connected to MongoDB");
});

/* ---------- REQUEST FOOD ---------- */
app.post("/api/request", async (req, res) => {
  try {
    const newReq = new Request({
      name: req.body.name,
      address: req.body.address,
      food: req.body.food,
      people: req.body.people
    });

    await newReq.save(); // Save to MongoDB
    res.json({ message: "Request saved to database", newReq });
  } catch (err) {
    res.status(500).json({ error: "Failed to save request" });
  }
});

/* ---------- GET ALL REQUESTS ---------- */
app.get("/api/request", async (req, res) => {
  try {
    const allRequests = await Request.find().sort({ createdAt: -1 });
    res.json(allRequests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

/* ---------- DONATE FOOD ---------- */
app.post("/api/donate", async (req, res) => {
  try {
    const newDonation = new Donation({ ...req.body });
    await newDonation.save();
    res.json(newDonation);
  } catch (err) {
    res.status(500).json({ error: "Failed to save donation" });
  }
});

/* ---------- MATCH & REMOVE REQUEST ---------- */
app.post("/api/match", async (req, res) => {
  try {
    const { requestId } = req.body;
    // Remove from MongoDB by ID
    await Request.findByIdAndDelete(requestId);
    res.json({ success: true, message: "Request matched and removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to match request" });
  }
});

/* ---------- Local Server ---------- */
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Local Backend running at http://localhost:${PORT}`);
  });
}

/* ---------- Export for Vercel ---------- */
module.exports = app;require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());

/* ---------- MongoDB Connection ---------- */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

/* ---------- Database Schemas ---------- */
const RequestSchema = new mongoose.Schema({
  name: String,
  address: String,
  food: String,
  people: Number,
  createdAt: { type: Date, default: Date.now }
});
const Request = mongoose.model("Request", RequestSchema);

const DonationSchema = new mongoose.Schema({
  donorName: String,
  foodDetails: String,
  quantity: String,
  createdAt: { type: Date, default: Date.now }
});
const Donation = mongoose.model("Donation", DonationSchema);

/* ---------- Nodemailer Configuration ---------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Set this in your .env
    pass: process.env.EMAIL_PASS  // Set your App Password in your .env
  }
});

/* ---------- Routes ---------- */

app.get("/", (req, res) => {
  res.send("🚀 Smart Food Backend is Live and Connected to MongoDB");
});

// REQUEST FOOD with Email Notification
app.post("/api/request", async (req, res) => {
  try {
    const newReq = new Request({
      name: req.body.name,
      address: req.body.address,
      food: req.body.food,
      people: req.body.people
    });

    await newReq.save();

    // Send Email to Admin/Donor
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sending to yourself for notification
      subject: "📢 New Food Request Available!",
      html: `
        <h3>New Request Details:</h3>
        <p><b>Name:</b> ${newReq.name}</p>
        <p><b>Address:</b> ${newReq.address}</p>
        <p><b>Items:</b> ${newReq.food}</p>
        <p><b>For:</b> ${newReq.people} people</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log("❌ Email Error:", error);
      else console.log("📧 Email Sent:", info.response);
    });

    res.json({ message: "Request saved and email notification triggered", newReq });
  } catch (err) {
    res.status(500).json({ error: "Failed to save request" });
  }
});

app.get("/api/request", async (req, res) => {
  try {
    const allRequests = await Request.find().sort({ createdAt: -1 });
    res.json(allRequests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

app.post("/api/match", async (req, res) => {
  try {
    const { requestId } = req.body;
    await Request.findByIdAndDelete(requestId);
    res.json({ success: true, message: "Request matched and removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to match request" });
  }
});

/* ---------- Server Logic ---------- */
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`🚀 Local Backend at http://localhost:${PORT}`));
}

module.exports = app;