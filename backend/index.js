const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
require("./db"); // connect MongoDB

const athleteRoutes = require("./routes/athleteRoutes");

app.use(helmet());
app.use(cors());
app.use(express.json()); // for POST requests

// Static top-athletes array
const athletes = [
  { id: 1, name: "John", duration: 120, age: 25, sport: "Running" },
  { id: 2, name: "Alice", duration: 90, age: 23, sport: "Cycling" },
  { id: 3, name: "Bob", duration: 150, age: 27, sport: "Swimming" },
  { id: 4, name: "Tom", duration: 130, age: 28, sport: "Gymnastics" },
  { id: 5, name: "Emma", duration: 110, age: 22, sport: "Yoga" },
  { id: 6, name: "Ryan", duration: 160, age: 30, sport: "Boxing" },
  { id: 7, name: "Sara", duration: 140, age: 24, sport: "Tennis" },
  { id: 8, name: "Mike", duration: 100, age: 26, sport: "Wrestling" },
  { id: 9, name: "Lily", duration: 130, age: 29, sport: "Karate" },
  { id: 10, name: "James", duration: 80, age: 21, sport: "Zumba" },
  { id: 11, name: "Sophia", duration: 125, age: 23, sport: "CrossFit" },
  { id: 12, name: "David", duration: 105, age: 32, sport: "Martial Arts" }
];


app.get("/", (req, res) => {
  res.send("🏋️‍♂️ Welcome to the Arthlete API! Use /top-athletes to see top 10 athletes based on workout duration.");
});

app.get("/top-athletes", (req, res) => {
  const topAthletes = athletes
    .slice()
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);

  res.json({
    timestamp: new Date(),
    totalTopAthletes: topAthletes.length,
    data: topAthletes
  });
});

// MongoDB-based APIs
app.use("/", athleteRoutes);

app.listen(3000, () => {
  console.log("✅ Server is running on port 3000");
});
