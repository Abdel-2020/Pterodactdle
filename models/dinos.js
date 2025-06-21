const mongoose = require("mongoose");
const DinoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A value for the species must be entered"],
    trim: true,
    maxlength: [30, "Name cannot be longer than 30 characters"],
  },
  period: {
    type: String,
    enum: ["Triassic", "Jurassic", "Cretaceous"], //only allows these string values.
    required: [true, "A value for the period must be entered"],
    trim: true,
  },
  diet: {
    type: String, //**************
    enum: ["Carnivore", "Herbivore", "Omnivore"],
    required: [true, "A value for the diet must be entered"],
    trim: true,
  },
  clade: {
    type: String,
    enum: [
      "Theropod",
      "Sauropod",
      "Ornithopod",
      "Thyreophora",
      "Marginocephalia",
    ],
    required: [true, "A value for the clade must be entered"],
    trim: true,
  },
  height: {
    type: Number,
    required: [true, "A height value of type Number must be entered"],
  },
  weight: {
    type: Number,
    required: [true, "A weight value of type Number must be entered"],
  },
});

module.exports = mongoose.model("Dino", DinoSchema);
