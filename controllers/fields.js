const Field = require('../models/field');
const User = require('../models/user');
const Contact = require('../models/contact');

module.exports = {
    create,
    deleteById,
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

function deleteById(req, res) {
    User.findById(req.body.user).populate('contactFields').exec(function(err, user) {
        let fieldForDeletion = user.contactFields.find(field => field._id == req.body.field);
        if (fieldForDeletion.removeable) {
            let contactFields = [...user.contactFields].filter(field => field != req.body.field);
            User.findByIdAndUpdate(req.body.user, contactFields, function(err, updatedUser) {
                Field.findByIdAndDelete(req.body.field, function(err, deletedField) {
                    res.send({errors: err});
                    Contact.find({owner: user._id}, function(err, contacts) {
                        contacts.forEach(contact => {
                            let fields = {...contact.fields};
                            delete fields[deletedField.name];
                            console.log(fields);
                            Contact.findByIdAndUpdate(contact._id, {fields}, function(err, updatedContact) {
                                if (err) console.log(err);
                            });
                        });
                    });
                });
            });
        } else {
            res.send({errors: 'you cannot delete this field as it is not removeable'});
        }
    });
}