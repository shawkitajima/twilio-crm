const Report = require('../models/report');
const Contact = require('../models/contact');

module.exports = {
    runReport,
    getAll,
    create,
    deleteById,
    update,
}

// accepts a report id to "run" a report
// grabs all contacts whose owner is the report owner, and then iterates through the criteria
// assumes all criteria are "AND" criteria
function runReport(req, res) {
    Report.findById(req.params.id, function(err, report) {
        Contact.find({owner: report.owner}, function(err, allContacts) {
            let contacts = [];
            report.criteria.forEach((criteria, idx) => {
                console.log(criteria);
                if (!idx) {
                    contacts = [...checkCriteria(allContacts, criteria.criteria, criteria.value, criteria.method)]
                } else {
                    contacts = [...checkCriteria(contacts, criteria.criteria, criteria.value, criteria.method)]
                }
            })
            res.send(contacts);
        });
    })
}


// utility function for checking criteria
function checkCriteria(allContacts, criteria, value, method) {
    let contacts = allContacts.filter(contact =>
        filterFunctions[method](contact.fields[criteria], value)
    );
    return contacts;
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


let filterFunctions = {
    exactMatch: function(value, criteriaValue) {
        console.log(value, criteriaValue);
        return value === criteriaValue;
    },
    includes: function(value, criteriaValue) {
        return value.includes(criteriaValue);
    }
}