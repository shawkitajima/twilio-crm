const Contact = require('../models/contact');
const User = require('../models/user');

const csv=require('csvtojson')

module.exports = {
    create,
    deletebyId,
    updatebyId,
}

function create(req, res) {
    // we first need to grab the contact fields so that contact adheres to the fields
    User.findById(req.body.id, function(err, user) {
        // we are going to make a separate fields obj
        // and update the values that exist in the contact fields
        let fields = user.contactFields.reduce((acc, field) => ({...acc, [field]: null}), {});
        let newFields = req.body.fields;
        let errors = [];
        Object.keys(newFields).forEach(key => {
            if (user.contactFields.includes(key)) {
                fields[key] = newFields[key];
            } else {
                errors.push(`${key} is not included in your contact fields so ${newFields[key]} was not uploaded`);
            }
        });
        Contact.create({owner: req.body.id, fields}, function(err, contact) {
            User.findByIdAndUpdate(req.body.id, {contacts: [...user.contacts, contact._id]}, 
                function(err, updatedUser) {
                    res.send({errors});
            });
        });
    });
}

function deletebyId(req, res) {
    User.findById(req.params.userId, function(err, user) {
        let contacts = [...user.contacts].filter(contact => contact !== req.params.contactId);
        User.findByIdAndUpdate(req.params.userId, {contacts}, function(err, newUser) {
            if (err) console.log(err);
            Contact.findByIdAndDelete(req.params.contactId, function(err, deletedContact) {
                res.send(deletedContact);
            });
        });
    });
}

function updatebyId(req, res) {
    Contact.findById(req.body.id, function(err, contact) {
        // we are going to grab the user so we can check the contact fields
        User.findById(contact.owner, function(err, user) {
            // Now we can check the update fields against the contact fields
            // If the key is there, then we update
            let updateFields = req.body.fields;
            let fields = {...contact.fields};
            let errors = [];
            Object.keys(updateFields).forEach(key => {
                if (user.contactFields.includes(key)) {
                    fields[key] = updateFields[key];
                } else {
                    errors.push(`${key} could not be updated as this field is not defined`);
                }
            });
            Contact.findByIdAndUpdate(req.body.id, {fields}, function(err) {
                res.send(errors);
            });
        });
    });
}