// Pet schema
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  breed: { type: String, required: true },
  description: String,
  image: String,
  adopted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Pet', petSchema);
