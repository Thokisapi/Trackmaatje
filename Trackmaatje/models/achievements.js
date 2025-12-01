const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const achievementsSchema = new Schema(
  {
    achievement:{
      type: String,
    },
    achievementStatus:{
      type: Boolean,
      default: false,
    },
    dateAchieved:{
      type: Date,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('achievements', achievementsSchema);