const readlineSync = require('readline-sync');
const fs = require('fs');
const log4js = require('log4js');
const moment = require('moment');

const Account = require('./accounts.js');
const Transaction = require('./transactions.js');
const parseInput = require('./inputFile.js');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

const logger = log4js.getLogger("index.js");

logger.info("Program has started.");

try {
    const transactions = parseInput("Transactions2013.json");
    const accounts = processData(transactions);
    userInstruction(accounts);
} catch (e){
    if (e === "Stop Process") {
        console.log("Goodbye");
    } else {
        console.log(e);
    }
}

function processData(transactions) {
    //removed code which converts data into rows
     const errors = countErrors(transactions);

     if (errors.size !== 0) {
         printErrors(errors);
         const query = readlineSync.question("Do you want to continue anyway with the remaining data? (y/N)");
         if (query.toUpperCase() !== "Y") {
             throw "Stop Process"
         }
     }
    return processWithoutErrors(transactions, errors);
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

function processWithoutErrors(transactions, errors) {
    const accounts = new Map();
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

function userInstruction(accounts) {
    let command = readlineSync.question("Enter command:");
    if (command.toUpperCase() === "LIST ALL") {
        //console.log(accounts);
        accounts.forEach(function(account) {account.printNameAndTotal()});
        console.log("Note negative total is owed")
    } else if ((command.slice(0,4)).toUpperCase() === "LIST") {
        let name = command.slice(5);
        if (accounts.has(name)) {
            (accounts.get(name)).printTransactions();
        } else {
            console.log("Account name not recognised");
        }
    } else {console.log("Command not recognised")}

}


function checkAndAddAccount(name, accounts) {
    if (!accounts.has(name)) {
        accounts.set(name, new Account(name));
    }
}
