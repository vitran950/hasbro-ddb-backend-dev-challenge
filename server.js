const express = require("express");
const bodyParser = require("body-parser");
const { connectMongoDB } = require("./services/dbService");
const {
  applyDamage,
  healCharacter,
  applyTempHitPoints,
} = require("./services/characterService");

// setup express server
const app = express();
const port = 3000;
app.use(bodyParser.json());

// setup mongoDB client
let db;
const connectDB = async () => {
  try {
    db = await connectMongoDB();
  } catch (err) {
    console.error("Database connection failed", err);
  }
};
connectDB();

app.put("/character/:name/damage", async (req, res) => {
  const { name } = req.params;
  const { damage, type } = req.body;
  const collection = db.collection("characters");

  try {
    const message = await applyDamage(collection, name, damage, type);
    console.log("(PUT) /character/:name/damage: " + message);
    res.send(message);
  } catch (err) {
    if (err.message.includes("does not exist")) {
      res.status(404).send(err.message);
    } else {
      console.error(err);
      res.status(500).send("Internal Server Error.");
    }
  }
});

app.put("/character/:name/heal", async (req, res) => {
  const { name } = req.params;
  const { health } = req.body;
  const collection = db.collection("characters");

  try {
    const message = await healCharacter(collection, name, health);
    console.log("(PUT) /character/:name/heal: " + message);
    res.send(message);
  } catch (err) {
    console.error(err);
    if (err.message.includes("does not exist")) {
      res.status(404).send(err.message);
    } else {
      res.status(500).send("Internal Server Error.");
    }
  }
});

app.put("/character/:name/tempHitPoints", async (req, res) => {
  const { name } = req.params;
  const { tempHitPoints } = req.body;
  const collection = db.collection("characters");

  try {
    const message = await applyTempHitPoints(collection, name, tempHitPoints);
    console.log("(PUT) /character/:name/tempHitPoints: " + message);
    res.send(message);
  } catch (err) {
    console.error(err);
    if (err.message.includes("does not exist")) {
      res.status(404).send(err.message);
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
