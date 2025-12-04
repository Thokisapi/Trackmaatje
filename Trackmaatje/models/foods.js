const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const foods = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 1,
    },
    proteins: {
      type: Number,
      required: true,
    },
    carbs: {
      type: Number,
      required: true,
    },
    fats: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      default: "unknown",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("food", foods);
