const moment = require('moment');
const { parse } = require('json2csv');
const path = require('path');
const fs = require('fs');

module.exports = {
    exportCsv,
    unnestContacts,
}

function unnestContacts(contacts) {
    const filteredContacts = [];
    contacts.forEach(contact => {
        let id = {id: contact._id};
        let obj = {...id, ...contact.fields};
        filteredContacts.push(obj);
    });
    return filteredContacts;
}

function exportCsv(res, details, fields, fileName) {
    let csv;
    try {
        csv = parse(details, {fields});
      } catch (err) {
        console.error(err);
      }
    const dateTime = moment().format('YYYYMMDDhhmmss');
    const filePath = path.join(__dirname, '../', 'public', 'exports', fileName + '-' + dateTime + '.csv');
    fs.writeFile(filePath, csv, function(err) {
        if (err) {
            console.log(err);
            return res.json(err).status(500);
        }
        else {
            res.download(filePath, `${fileName}-${dateTime}.csv`);
            setTimeout(() => fs.unlinkSync(filePath), 30000);
        }
    });
}