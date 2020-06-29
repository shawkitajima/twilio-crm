const Report = require('../models/report');

module.exports = {
    getAll,
    create,
    deleteById,
    update,
}

function getAll(req, res) {
    Report.find({owner: req.params.id}, function(err, reports) {
        res.send(reports);
    });
}

function create(req, res) {
    Report.create({
        name: req.body.name,
        owner: req.body.id,
        criteria: req.body.criteria,
    }, function(err, report) {
        res.send(report);
    });
}

function deleteById(req, res) {
    Report.findByIdAndDelete(req.params.id, function(err, deletedReport) {
        res.send(deletedReport);
    });
}

function update(req, res) {
    if (!req.body.id) res.send({errors: "no id provided"});
    Report.findById(req.body.id, function(err, report) {
        let name = req.body.name ? req.body.name : report.name;
        let criteria = req.body.criteria ? req.body.criteria : report.criteria;
        Report.findByIdAndUpdate(req.body.id, {
            name,
            criteria
        }, {new: true}, function(err, updatedReport) {
            res.send(updatedReport);
        });
    });
}