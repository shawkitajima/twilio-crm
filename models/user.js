const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 6;

const userSchema = new Schema({
  name: String,
  email: {type: String, required: true, lowercase: true, unique: true},
  password: String,
  contacts: [{type: Schema.Types.ObjectId, ref: 'Contact'}],
  // contacts should have fields assigned to them on a user basis, as different users may want different fields
  // we can also access these fields in the front-end, so users can edit them
  contactFields: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Field',
    }],
    default: ['5ee2b0baed3f3c2c7e797f91', '5ee2b0aced3f3c2c7e797f90', '5ee2b092ed3f3c2c7e797f8f', '5ee2b081ed3f3c2c7e797f8e', '5ee2b074ed3f3c2c7e797f8d', '5ee2b059ed3f3c2c7e797f8c', '5ee2b04ded3f3c2c7e797f8b', '5ee2b044ed3f3c2c7e797f8a', '5ee2b028ed3f3c2c7e797f89']
  },
  reports: [{type: Schema.Types.ObjectId, ref: 'Report'}],
  phones: [String],
}, {
  timestamps: true
});

userSchema.set('toJSON', {
  transform: function(doc, ret) {
    // remove the password property when serializing doc to JSON
    delete ret.password;
    return ret;
  }
});

// This is how we hash our passwords
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return
  // password has changed! - salt and hash
  bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(tryPassword, cb) {
  bcrypt.compare(tryPassword, this.password, cb);
}


module.exports = mongoose.model('User', userSchema);