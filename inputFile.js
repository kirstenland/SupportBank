const fs = require('fs');
const moment = require('moment');
const log4js = require('log4js');
const parseXMLString = require('xml2js').parseString;
const { getJsDateFromExcel } = require('excel-date-to-js');

const Transaction = require('./transactions.js');

const logger = log4js.getLogger("inputFile.js");

function parseInput(filename) {
    const x = filename.lastIndexOf('.');
    const suffix = filename.slice(x+1);
    if (suffix.toLowerCase() === "csv") {
        return parseCSV(filename);
    } else if (suffix.toLowerCase() === "json") {
        return parseJSON(filename);
    } else if (suffix.toLowerCase() === "xml") {
        return parseXML(filename);
    } else {
        logger.error(`Unknown file ending: ${suffix}`);
        throw "file type not recognised, supported file types are .json and .csv";
    }
}

function parseJSON(filename) {
    const transactions = [];
    let data = fs.readFileSync(filename, 'utf8');
    const objects = JSON.parse(data);
    objects.forEach(function(obj){
        const date = moment(obj.Date, "YYYY-MM-DD HH:mm:ss");
        transactions.push(new Transaction(date, obj.FromAccount, obj.ToAccount, obj.Narrative, obj.Amount
    ));
    });
    return transactions;
}

function parseCSV(filename) {
    const transactions = [];
    let data = fs.readFileSync(filename, 'utf8');
    let rows = data.split("\n");
    rows.shift();
    rows.pop();
    rows.forEach(function(row){
        const trans = row.split(",");
        const date = moment(trans[0], "DD-MM-YYYY");
        transactions.push(new Transaction(date, trans[1], trans[2], trans[3], trans[4]));
    });
    return transactions;
}

function parseXML(filename) {
    const transactions = [];
    const data = fs.readFileSync(filename, 'utf8');
    let transList;
    parseXMLString(data, function(err, result) {
        transList = result.TransactionList.SupportTransaction;
    });
    transList.forEach(function (obj) {
        const date = moment(getJsDateFromExcel(obj["$"].Date));
        const trans = new Transaction(date, obj.Parties[0].From[0], obj.Parties[0].To[0], obj.Description[0], obj.Value[0])
        transactions.push(trans);
    });
    return transactions;
}

module.exports = parseInput;
