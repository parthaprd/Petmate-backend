const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const COLLECTION_NAME = "adoptionrequests";

const AdoptionRequest = {
  async findAll() {
    const db = getDB();
    return db.collection(COLLECTION_NAME).find({}).toArray();
  },

  async findById(id) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  },

  async findOne(filter) {
    const db = getDB();
    const query = {};
    if (filter.petId) query.petId = new ObjectId(filter.petId);
    if (filter.userEmail) query.userEmail = filter.userEmail;
    if (filter._id) query._id = new ObjectId(filter._id);
    return db.collection(COLLECTION_NAME).findOne(query);
  },

  async create(requestData) {
    const db = getDB();
    const result = await db.collection(COLLECTION_NAME).insertOne({
      petId: new ObjectId(requestData.petId),
      petName: requestData.petName,
      userName: requestData.userName,
      userEmail: requestData.userEmail,
      pickupDate: requestData.pickupDate,
      message: requestData.message || "",
      status: requestData.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { _id: result.insertedId, ...requestData };
  },

  async updateOne(id, updateData) {
    const db = getDB();
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    return result;
  },

  async updateMany(filter, updateData) {
    const db = getDB();
    const query = {};
    if (filter.petId) query.petId = new ObjectId(filter.petId);
    if (filter._id && filter._id.$ne) query._id = { $ne: new ObjectId(filter._id.$ne) };
    
    const result = await db.collection(COLLECTION_NAME).updateMany(
      query,
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    return result;
  },

  async deleteOne(id) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
  },

  async findOneAndDelete(filter) {
    const db = getDB();
    const query = {};
    if (filter._id) query._id = new ObjectId(filter._id);
    if (filter.userEmail) query.userEmail = filter.userEmail;
    
    const doc = await db.collection(COLLECTION_NAME).findOne(query);
    if (doc) {
      await db.collection(COLLECTION_NAME).deleteOne(query);
    }
    return doc;
  },

  async findByPetId(petId) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).find({ petId: new ObjectId(petId) }).toArray();
  },

  async findByUserEmail(email) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).find({ userEmail: email }).toArray();
  },

  async findByStatus(status) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).find({ status }).toArray();
  },

  async deleteMany(filter = {}) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).deleteMany(filter);
  },
};

module.exports = AdoptionRequest;
