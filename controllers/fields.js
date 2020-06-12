const Field = require('../models/field');
const User = require('../models/user');
const Contact = require('../models/contact');

module.exports = {
    create,
}   

function create(req, res) {
    User.findById(req.body.id, function(err, user) {
        Field.create(req.body.field, function(err, field) {
            if (err) {
                console.log(err);
                return res.send({errors: err});
            }
            let contactFields = [...user.contactFields];
            contactFields.push(field._id);
            res.send({errors: 'none'});
            User.findByIdAndUpdate(user._id, {contactFields}, function(err, updatedUser) {
                Contact.find({owner: user._id}, function(err, contacts) {
                    contacts.forEach(contact => {
                        let fields = {...contact.fields};
                        fields[field.name] = null;
                        Contact.findByIdAndUpdate(contact._id, {fields}, function(err, updatedContact) {
                            if (err) console.log(err);
                        });
                    });
                });
            });
        });
    })
}