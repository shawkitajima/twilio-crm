const Contact = require('../models/contact');
const User = require('../models/user');

const csv=require('csvtojson')

module.exports = {
    create,
    readCsv,
}

function create(req, res) {
    Contact.create(req.body.contact, function(err, contact) {
        User.findById(req.body.contact.owner, function(err, user) {
            const contacts = [...user.contacts];
            contacts.push(contact._id);
            User.findByIdAndUpdate(user._id, {contacts}, {new: true}, function(err, updatedUser) {
                res.send(updatedUser);
            });
        });
    });
}

function readCsv(req, res) {
    csv()
    .fromFile(req.file.path)
    .then(objArr => {
        objArr.forEach(obj => {
            obj.owner = req.body.id;
        });
        Contact.create(objArr, function(err, result) {
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