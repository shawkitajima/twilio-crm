const Field = require('../models/field')

module.exports = {
    create,
}   

function create(req, res) {
    Field.create(req.body, function(err, field) {
        res.send(field);
    });
}