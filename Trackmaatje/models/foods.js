const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foods = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    proteins: {
      type: Number,
      required: true,
    },
    carbs: {
      type: Number,
      required: true,
    },
    Fats: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('food', foods);