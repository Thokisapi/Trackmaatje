const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const userInfo = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    default: 0,
  },
  fats: {
    type: Number,
    default: 0,
  },
  carbs: {
    type: Number,
    default: 0,
  },
  proteins: {
    type: Number,
    default: 0,
  },
  activitylevel: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  streak: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("userInfo", userInfo);
