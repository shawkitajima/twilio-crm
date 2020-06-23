const Field = require('../models/field');
const User = require('../models/user');
const Contact = require('../models/contact');

module.exports = {
    create,
    deleteById,
    update,
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

function update(req, res) {
    User.findById(req.body.id, function(err, user) {
        Field.findById(req.body.fieldId, function(err, field) {
            // check for errors
            if (!user.contactFields.includes(field._id)) return res.send({errors: 'this field does not belong to this user'});
            if (!field.removeable) return res.send({errors: 'you cannot edit this field'});
            // we don't know what they want to update, so we check changes
            let name = req.body.name ? req.body.name : field.name;
            let dataType = req.body.dataType ? req.body.dataType : field.dataType;
            // grab  the old name
            let oldName = field.name
            Field.findByIdAndUpdate(field._id, {name, dataType}, {runValidators: true}, function(errors, updatedField) {
                res.send({errors});
                // Update each of the contacts to have this field
                Contact.find({owner: user._id}, function(err, contacts) {
                  contacts.forEach(contact => {
                    let fields = {...contact.fields};
                    let value = fields[oldName];
                    delete fields[oldName];
                    fields[name] = value;
                    Contact.findByIdAndUpdate(contact._id, {fields}, function(err, updatedContact) {
                        if (err) console.log(err);
                    });
                  });
                });
            });
        });
    });
}