const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  name: String,
  owner: Schema.Types.ObjectId,
  criteria: Array,
}, {
  timestamps: true
});


module.exports = mongoose.model('Report', reportSchema);