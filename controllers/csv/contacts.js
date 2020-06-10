const Contact = require('../../models/contact');
const User = require('../../models/user');
const csv=require('csvtojson')

module.exports = {
    create,
}




function create(req, res) {
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