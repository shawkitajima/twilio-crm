const Contact = require('../../models/contact');
const User = require('../../models/user');
const csv=require('csvtojson')
const mongoose = require('mongoose');

module.exports = {
    create,
    deleteByIds,
}


function create(req, res) {
    User.findById(req.body.id)
    .populate('contactFields')
    .exec(function(err, user) {
        csv()
        .fromFile(req.file.path)
        .then(objArr => {
            // initialize the parent and error array
            let contacts = [];
            let errors = [];
            // update the arrays
            objArr.forEach(contact => {
                let fields = user.contactFields.reduce((acc, field) => ({...acc, [field.name]: null}), {});
                Object.keys(contact).forEach(key => {
                    if (user.contactFields.some(field => field.name === key)) {
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
                    res.send({errors});
                });
            });
        });
    });
}

// we have several issues with mongoose ObjectIds equality checks using arr.includes
// strangely, .includes when comparing ObjectIds to ObjectIds do not work
// in order to get .filter and .includes to work together, we needed to convert the user's contact's array to strings
// however, for mongoose to accept updated, the _ids had to be converted back to mongoose ObjectIds
function deleteByIds(req, res) {
    User.findById(req.body.id, function(err, user) {
        csv()
        .fromFile(req.file.path)
        .then(objArr => {
            let idArr = objArr.map(contact => contact.id);
            let contactsStrings = [...user.contacts].map(contact => contact.toString());
            let includedStrings = idArr.filter(contact => contactsStrings.includes(contact));
            let errorStrings = idArr.filter(contact => !contactsStrings.includes(contact));
            let errors = errorStrings.map(contact => `${contact} was not found in user contacts`);
            let contactsStringsRemoved = contactsStrings.filter(contact => !includedStrings.includes(contact));
            let contacts = contactsStringsRemoved.map(contact => mongoose.Types.ObjectId(contact));
            let includedArr = includedStrings.map(contact => mongoose.Types.ObjectId(contact));
            User.findByIdAndUpdate(req.body.id, {contacts}, function(err, updatedUser) {
                if (err) console.log(err);
                Contact.deleteMany({
                    _id: {
                        $in: includedArr
                    }
                }, function(err, result) {
                    if (err) console.log(err);
                    res.send(errors);
                });
            });
        });
    });
}



