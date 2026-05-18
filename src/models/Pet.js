const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    imageUrl: { type: String, required: true },
    healthStatus: { type: String, required: true },
    vaccinationStatus: { type: String, required: true },
    location: { type: String, required: true },
    adoptionFee: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "adopted"],
      default: "available",
    },
  },
  { timestamps: true, collection: "pets" }
);

module.exports = mongoose.model("Pet", PetSchema);
