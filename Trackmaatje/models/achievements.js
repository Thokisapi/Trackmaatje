const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const achievementsSchema = new Schema(
  {
    
  },
    { timestamps: true },
);
module.exports = mongoose.model('achievements', achievementsSchema);