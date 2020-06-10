const Contact = require('../models/contact');
const User = require('../models/user');

const csv=require('csvtojson')

module.exports = {
    create,
    createFromCSV,
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

function createFromCSV(req, res) {
    User.findById(req.body.id, function(err, user) {
        csv()
        .fromFile(req.file.path)
        .then(objArr => {
            // initialize the parent and error array
            let contacts = [];
            let errors = [];
            // update the arrays
            objArr.forEach(contact => {
                let fields = user.contactFields.reduce((acc, field) => ({...acc, [field]: null}), {});
                Object.keys(contact).forEach(key => {
                    if (user.contactFields.includes(key)) {
                        fields[key] = contact[key];
                    } else {
                        errors.push(`${key} is not included in your contact fields so ${contact[key]} was not uploaded`);
                    }
                });
                contacts.push({owner: user._id, fields});
            });
            // we need to attach the contacts back to the user
            Contact.create(contacts, function(err, createdContacts) {
                let addedContacts = createdContacts.map(contact => contact._id);
                User.findByIdAndUpdate(user._id, {contacts: [...user.contacts, ...addedContacts]}, function(err, updatedUser) {
                    res.send(errors);
                });
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
        User.findById(contact.owner, function(err, user) {
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