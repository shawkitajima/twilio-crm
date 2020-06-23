const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// when we create reports, we need to be able to customize search criteria
// for example, dates rely on time before or after
// strings contain characters
// booleans are yes or no

// We will put the field schema on a user
// Whenever a user adds a field, they will have to denote the dataType
// This way, when we eventually run reports, each dataType will have custom query methods
// Honestly, I think this is what TypeScript is for

const fieldSchema = new Schema({
  name: String,
  dataType: {
      type: String,
      enum: ['text', 'number', 'phone', 'date', 'boolean', 'email', 'address']
  },
  removeable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
});


module.exports = mongoose.model('Field', fieldSchema);