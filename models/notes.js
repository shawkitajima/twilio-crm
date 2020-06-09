const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'Contact'},
  body: String,
}, {
  timestamps: true
});


module.exports = mongoose.model('Note', noteSchema);