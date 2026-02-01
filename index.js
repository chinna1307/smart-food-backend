const express = require("express");
const cors = require("cors");

const app = express();

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());

/* ---------- Root Test Route (Fixes Cannot GET /) ---------- */
app.get("/", (req, res) => {
  res.send("🚀 Smart Food Backend is Live");
});

/* ---------- In-Memory Data (for demo) ---------- */
let requests = [];
let donations = [];

/* ---------- REQUEST FOOD ---------- */
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

/* ---------- GET ALL REQUESTS ---------- */
app.get("/api/request", (req, res) => {
  res.json(requests);
});

/* ---------- DONATE FOOD ---------- */
app.post("/api/donate", (req, res) => {
  const donation = {
    id: Date.now(),
    ...req.body
  };

  donations.push(donation);
  res.json(donation);
});

/* ---------- MATCH & REMOVE REQUEST ---------- */
app.post("/api/match", (req, res) => {
  const { requestId } = req.body;

  requests = requests.filter(
    r => r.id !== Number(requestId) && r.id !== requestId
  );

  res.json({ success: true });
});

/* ---------- Local Server (Only for Local) ---------- */
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Local Backend running at http://localhost:${PORT}`);
  });
}

/* ---------- Export for Vercel ---------- */
module.exports = app;
