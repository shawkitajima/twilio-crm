const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  owner: Schema.Types.ObjectId,
  fields: Object,
  associations: [{type: Schema.Types.ObjectId, ref: 'Contact'}]
}, {
  timestamps: true
});


module.exports = mongoose.model('Contact', contactSchema);