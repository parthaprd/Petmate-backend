const mongoose = require("mongoose");

const AdoptionRequestSchema = new mongoose.Schema(
  {
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    petName: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    pickupDate: { type: String, required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true, collection: "adoptionrequests" }
);

module.exports = mongoose.model("AdoptionRequest", AdoptionRequestSchema);
