const Contact = require('../../models/contact');
const User = require('../../models/user');
const csv = require('csvtojson');

module.exports = {
    create,
    deleteByIds,
    updateByIds,
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
                res.send({errors});
            });
        });
    });
}

function deleteByIds(req, res) {
    User.findById(req.body.id, function(err, user) {
        csv()
        .fromFile(req.file.path)
        .then(objArr => {
            let idArr = objArr.map(contact => contact.id);
            Contact.deleteMany({
                _id: {
                    $in: idArr
                }
            }, function(errors, result) {
                if (errors) console.log(errors);
                res.send({errors});
            });
        });
    });
}

function updateByIds(req, res) {
    // grab the user model so we can validate fields
    User.findById(req.body.id).populate('contactFields').exec(function(err, user) {
        if (err) return res.send({errors: err});
        csv()
        .fromFile(req.file.path)
        .then(objArr => {
            let errors = [];
            Promise.all(objArr.map(contact => update(contact.id, contact, user.contactFields))).then(responses => {
                responses.forEach(err => {
                    errors = [...errors, ...err];
                });
                res.send({errors});
            });
        }); 
    });
}


// Update by Id helper function
function update(id, updateFields, contactFields) {
    return new Promise((resolve, reject) => {
        if (!id) return resolve(['missing id']);
        Contact.findById(id, function(err, contact) {
            let fields = {...contact.fields};
            let errors = [];
            Object.keys(updateFields).forEach(key => {
                if (contactFields.some(field => field.name === key)) {
                    fields[key] = updateFields[key];
                    // we're not going to bother adding the id field to the errors
                } else if (key !== "id") {
                    errors.push(`${key} could not be updated as this field is not defined for ${id}`);
                }
            });
            Contact.findByIdAndUpdate(id, {fields}, function(err) {
                if (err) resolve ({errors: err})
                resolve(errors);
            });
        });
    });
}

