const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// in-memory storage
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
  requests = requests.filter(r => r.id !== requestId);
  res.json({ success: true });
});

app.listen(5000, () =>
  console.log("🚀 Backend running at http://localhost:5000")
);
