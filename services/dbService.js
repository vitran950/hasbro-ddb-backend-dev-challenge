const { MongoClient } = require("mongodb");

// TODO: put into a constant/env file
const url = "mongodb://localhost:27017";
const dbName = "dnd";

async function connectMongoDB() {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    console.log(`Connected to MongoDB's client: ${url} and DB: ${dbName}.`);
    return db;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to connect to MongoDB");
  }
}

module.exports = { connectMongoDB };
