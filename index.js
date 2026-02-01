require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());

/* ---------- MongoDB Connection ---------- */
// Uses MONGO_URI from your Vercel/Local Environment Variables
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
// Updated to use MAIL_USER and MAIL_PASS from your .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS  
  }
});

/* ---------- Routes ---------- */

// Root Route to verify deployment
app.get("/", (req, res) => {
  res.send("🚀 Smart Food Backend is Live and Connected to MongoDB");
});

// POST: Request Food + Send Email
app.post("/api/request", async (req, res) => {
  try {
    const newReq = new Request({
      name: req.body.name,
      address: req.body.address,
      food: req.body.food,
      people: req.body.people
    });

    await newReq.save();

    // Send Email notification to yourself
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER, 
      subject: "📢 New Food Request Available!",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #22c55e;">New Food Request Received</h2>
          <p><b>Name:</b> ${newReq.name}</p>
          <p><b>Address:</b> ${newReq.address}</p>
          <p><b>Items:</b> ${newReq.food}</p>
          <p><b>Required for:</b> ${newReq.people} members</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Smart Food Donation Network - SVPCET Hackathon Project</p>
        </div>
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

// GET: All Requests
app.get("/api/request", async (req, res) => {
  try {
    const allRequests = await Request.find().sort({ createdAt: -1 });
    res.json(allRequests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// POST: Match & Remove Request
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

/* ---------- Export for Vercel ---------- */
module.exports = app;