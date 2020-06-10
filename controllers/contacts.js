const Contact = require('../models/contact');
const User = require('../models/user');

const csv=require('csvtojson')

module.exports = {
    create,
    createFromCSV,
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
                fields[key] = newFields[key]
            } else {
                errors.push(`${key} is not included in your contact fields so ${newFields[key]} could not be created`)
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


// requires csv to be included as file key, and user id to be passed in via req.body
function createFromCSV(req, res) {
    csv()
    .fromFile(req.file.path)
    .then(objArr => {
        // we need to format the csv object array properly
        creationArray = []
        objArr.forEach(obj => {
            creationArray.push({
                owner: req.body.id,
                fields: obj
            });
        });
        Contact.create(creationArray, function(err, result) {
            if (err) console.log(err);
            let addedIds = result.map(contact => contact._id);
            User.findById(req.body.id, function(err, user) {    
                if (err) console.log(err);
                let contacts = [...user.contacts, ...addedIds];
                User.findByIdAndUpdate(user._id, {contacts}, {new: true}, function(err, updatedUser) {
                    res.send(updatedUser);
                })
            });
        });
    });
}
