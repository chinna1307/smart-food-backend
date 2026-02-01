const express = require("express");
const cors = require("cors");

const app = express();

// 1. Updated CORS for production
app.use(cors());
app.use(express.json());

// In-memory storage (Note: This resets on serverless cold starts)
let requests = [];
let donations = [];

// ---------- REQUEST FOOD ----------
app.post("/api/request", (req, res) => {
  const newReq = {
    id: Date.now(),
    name: req.body.name,
    address: req.body.address,
    food: req.body.food,
    people: req.body.people
  };
  requests.push(newReq);
  res.json({ message: "Request saved", newReq });
});

// ---------- GET ALL REQUESTS ----------
app.get("/api/request", (req, res) => {
  res.json(requests);
});

// ---------- DONATE FOOD ----------
app.post("/api/donate", (req, res) => {
  const donation = {
    id: Date.now(),
    ...req.body
  };
  donations.push(donation);
  res.json(donation);
});

// ---------- MATCH ----------
app.post("/api/match", (req, res) => {
  const { requestId } = req.body;
  // Note: Check for both string and number IDs since Date.now() is a number
  requests = requests.filter(r => r.id !== Number(requestId) && r.id !== requestId);
  res.json({ success: true });
});

// 2. Wrap app.listen so it doesn't conflict with Vercel's handler
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () =>
    console.log(`🚀 Local Backend running at http://localhost:${PORT}`)
  );
}

// 3. EXPORT the app (Required for Vercel)
module.exports = app;