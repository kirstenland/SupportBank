const readlineSync = require("readline-sync");
const log4js = require("log4js");

const Account = require("./accounts.js");

const logger = log4js.getLogger("bank.js");

function processData(transactions, accounts) {
    const errors = countErrors(transactions);

    if (errors.size !== 0) {
        printErrors(errors);
        const query = readlineSync.question("Do you want to continue anyway with the remaining data? (y/N)");
        if (query.toUpperCase() !== "Y") {
            throw "Stop Process"
        }
    }
    return processWithoutErrors(transactions, errors, accounts);
}

function countErrors(transactions) {
    const errors = new Map();

    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        let errorMessage = "";
        if (isNaN(transaction.amount)) {
            logger.error(`Amount in row ${i} is not a number.`);
            errorMessage += `Amount in row ${i} is not a number.\n`;
        }
        if (!transaction.date.isValid()) {
            logger.error(`Date in row ${i} is not valid.`);
            errorMessage += `Date in row ${i} is not valid`;
        }
        if (errorMessage !== "") {
            errors.set(i, errorMessage);
        }
    }
    return errors;
}

function processWithoutErrors(transactions, errors, accounts) {
    for (let i = 0; i < transactions.length; i++) {
        if (!errors.has(i)) {
            const transaction = transactions[i];
            checkAndAddAccount(transaction.from, accounts);
            checkAndAddAccount(transaction.to, accounts);
            (accounts.get(transaction.to)).processToTransaction(transaction);
            (accounts.get(transaction.from)).processFromTransaction(transaction);
        }
    }
    return accounts;
}

function printErrors(errors) {
    errors.forEach(function(error) {
        console.log(error)
    });
}

function checkAndAddAccount(name, accounts) {
    if (!accounts.has(name)) {
        accounts.set(name, new Account(name));
    }
}

module.exports = processData;