const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

// setup express server
const app = express();
const port = 3000;
app.use(bodyParser.json());

// setup mongoDB client
const url = "mongodb://localhost:27017";
const dbName = "dnd";
let db;

// TODO: only connect to client when user makes the request or leave connection open for the life of the app?
MongoClient.connect(url)
  .then((client) => {
    db = client.db(dbName);
    console.log(`Connected to MongoDB's client: ${url} and DB: ${dbName}.`);
  })
  .catch((err) => console.error(err));

// TODO: separate into smaller methods/files
app.put("/character/:name/damage", async (req, res) => {
  const { name } = req.params;
  const { damage, type } = req.body;

  try {
    // TODO: put the DB table into a constant file
    const collection = db.collection("characters");
    const character = await collection.findOne({ name: name });

    if (character) {
      if (character.tempHitPoints && character.tempHitPoints > 0) {
        if (character.tempHitPoints >= damage) {
          character.tempHitPoints -= damage;
        } else {
          character.hitPoints -= damage - character.tempHitPoints;
          character.tempHitPoints = 0;
        }
      } else {
        character.hitPoints -= damage;
      }

      // ensure hitPoints do not go below zero
      if (character.hitPoints < 0) {
        character.hitPoints = 0;
      }

      // TODO: figure out a more simpler way to switch between the two
      let updateQry = {
        $set: {
          hitPoints: character.hitPoints,
        },
      };

      if (character.tempHitPoints >= 0) {
        updateQry = {
          $set: {
            hitPoints: character.hitPoints,
            tempHitPoints: character.tempHitPoints,
          },
        };
      }

      await collection.updateOne({ _id: character._id }, updateQry);
      const message = `${name}'s HP = ${character.hitPoints} and temporary HP = ${character.tempHitPoints}.`;
      console.log("(PUT) /character/:name/damage: " + message);
      res.send(message);
    } else {
      return res.status(404).send(`Character ${name} does not exist`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error.");
  }
});

app.put("/character/:name/heal", async (req, res) => {
  const { name } = req.params;
  const { health } = req.body;

  try {
    const collection = db.collection("characters");
    const character = await collection.findOne({ name: name });

    if (character) {
      // do we have a max health for the character?
      character.hitPoints += health;
      await collection.updateOne(
        { _id: character._id },
        { $set: { hitPoints: character.hitPoints } }
      );

      const message = `${name}'s HP = ${character.hitPoints}.`;
      console.log("(PUT) /character/:name/heal: " + message);
      res.send(message);
    } else {
      res.status(404).send(`Character ${name} does not exist.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error.");
  }
});

app.put("/character/:name/tempHitPoints", async (req, res) => {
  const { name } = req.params;
  const { tempHitPoints } = req.body;

  try {
    const collection = db.collection("characters");
    const character = await collection.findOne({ name: name });

    if (character) {
      if (character.tempHitPoints) {
        character.tempHitPoints = Math.max(
          character.tempHitPoints,
          tempHitPoints
        );
      } else {
        character.tempHitPoints = tempHitPoints;
      }

      await collection.updateOne(
        { _id: character._id },
        { $set: { tempHitPoints: character.tempHitPoints } }
      );

      const message = `${name}'s temporary HP = ${character.tempHitPoints}.`;
      console.log("(PUT) /character/:name/tempHitPoints: " + message);
      res.send(message);
    } else {
      res.status(404).send(`Character ${name} does not exist.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
