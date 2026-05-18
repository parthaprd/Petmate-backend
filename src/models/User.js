const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const COLLECTION_NAME = "users";

const User = {
  async findByUsername(username) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).findOne({ username });
  },

  async findByEmail(email) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).findOne({ email });
  },

  async findById(id) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  },

  async create(userData) {
    const db = getDB();
    const result = await db.collection(COLLECTION_NAME).insertOne({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || "user",
      createdAt: new Date(),
    });
    return { _id: result.insertedId, ...userData };
  },

  async findAll() {
    const db = getDB();
    return db.collection(COLLECTION_NAME).find({}).toArray();
  },

  async updateOne(id, updateData) {
    const db = getDB();
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result;
  },

  async deleteOne(id) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
  },
};

module.exports = User;
