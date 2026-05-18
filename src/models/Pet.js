const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const COLLECTION_NAME = "pets";

const Pet = {
  async findAll() {
    const db = getDB();
    return db.collection(COLLECTION_NAME).find({}).toArray();
  },

  async findById(id) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  },

  async findByOwnerEmail(email) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).find({ ownerEmail: email }).toArray();
  },

  async create(petData) {
    const db = getDB();
    const result = await db.collection(COLLECTION_NAME).insertOne({
      name: petData.name,
      species: petData.species,
      breed: petData.breed,
      age: petData.age,
      gender: petData.gender,
      imageUrl: petData.imageUrl,
      healthStatus: petData.healthStatus,
      vaccinationStatus: petData.vaccinationStatus,
      location: petData.location,
      adoptionFee: petData.adoptionFee || 0,
      description: petData.description,
      ownerEmail: petData.ownerEmail,
      status: petData.status || "available",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { _id: result.insertedId, ...petData };
  },

  async updateOne(id, updateData) {
    const db = getDB();
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    return result;
  },

  async deleteOne(id) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
  },

  async findByStatus(status) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).find({ status }).toArray();
  },

  async insertMany(documents) {
    const db = getDB();
    const docsWithTimestamps = documents.map(doc => ({
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    return db.collection(COLLECTION_NAME).insertMany(docsWithTimestamps);
  },

  async deleteMany(filter = {}) {
    const db = getDB();
    return db.collection(COLLECTION_NAME).deleteMany(filter);
  },
};

module.exports = Pet;
