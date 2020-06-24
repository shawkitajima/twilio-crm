const Contact = require('../models/contact');
const User = require('../models/user');

module.exports = {
    getById,
    create,
    deletebyId,
    updatebyId,
}

function getById(req, res) {
    Contact.find({owner: req.params.id}, function(err, contacts) {
        res.send(contacts);
    });
}

function create(req, res) {
    // we first need to grab the contact fields so that contact adheres to the fields
    User.findById(req.body.id)
    .populate('contactFields')
    .exec(function(err, user) {
        // we are going to make a separate fields obj
        // and update the values that exist in the contact fields
        let fields = user.contactFields.reduce((acc, field) => ({...acc, [field.name]: null}), {});
        let newFields = req.body.fields;
        let errors = [];
        Object.keys(newFields).forEach(key => {
            if (user.contactFields.some(field => field.name === key)) {
                fields[key] = newFields[key];
            } else {
                errors.push(`${key} is not included in your contact fields so ${newFields[key]} was not uploaded`);
            }
        });
        Contact.create({owner: req.body.id, fields}, function(err, contact) {
            if (err) return res.send(err);
            res.send({errors});
        });
    })
}

function deletebyId(req, res) {
    Contact.findByIdAndDelete(req.params.id, function(err, deletedContact) {
        res.send(deletedContact);
    });
}

function updatebyId(req, res) {
    Contact.findById(req.body.id, function(err, contact) {
        // we are going to grab the user so we can check the contact fields
        User.findById(contact.owner)
        .populate('contactFields')
        .exec(err, function(err, user) {
            // Now we can check the update fields against the contact fields
            // If the key is there, then we update
            let updateFields = req.body.fields;
            let fields = {...contact.fields};
            let errors = [];
            Object.keys(updateFields).forEach(key => {
                if (user.contactFields.some(field => field.name === key)) {
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