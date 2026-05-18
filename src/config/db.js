const { MongoClient } = require("mongodb");

let client;

async function connectDB() {
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("MongoDB Connected");
    return client;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

function getDB() {
  if (!client) {
    throw new Error("Database not connected");
  }
  return client.db();
}

async function closeDB() {
  if (client) {
    await client.close();
  }
}

module.exports = { connectDB, getDB, closeDB };
