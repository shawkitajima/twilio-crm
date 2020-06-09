const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: String,
  email: {type: String, required: false, lowercase: true},
  owner: Schema.Types.ObjectId,
  fields: Object,
  notes: [{type: Schema.Types.ObjectId, ref: 'Note'}],
  associations: [{type: Schema.Types.ObjectId, ref: 'Contact'}]
}, {
  timestamps: true
});


module.exports = mongoose.model('Contact', contactSchema);