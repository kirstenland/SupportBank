const readlineSync = require('readline-sync');
const fs = require('fs');
const log4js = require('log4js');
const moment = require('moment');

const Account = require('./accounts.js');
const Transaction = require('./transactions.js');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

const logger = log4js.getLogger("index.js");

logger.info("Program has started.")

fs.readFile("DodgyTransactions2015.csv", 'utf8',  function (err, data) {
    const accounts = processData(data);
    userInstruction(accounts);
});

function processData(data) {
     const accounts = new Map();
     let rows = data.split("\n");
     rows.shift();
     rows.pop();

     for (let i = 0; i < rows.length; i++){
        let row = rows[i];
        let trans = row.split(",")

        if (trans.length != 5) {
            logger.error(`Wrong number of columns in row ${i}: should be 5 columns but there are ${trans.length}.`);
        }
        if (isNaN(trans[4])) {
            logger.error(`Amount in row ${i} is not a number: ${trans[4]}`);
        }
        if (!moment(trans[0], "DD-MM-YYYY").isValid()) {
            logger.error(`Date in row ${i} is not valid: ${trans[0]}`);
        }

        let transaction = new Transaction(trans);
        //console.log(transaction);
        checkAndAddAccount(transaction.from, accounts);
        checkAndAddAccount(transaction.to, accounts);
        (accounts.get(transaction.to)).processToTransaction(transaction);
        (accounts.get(transaction.from)).processFromTransaction(transaction);
    };
    //console.log(accounts);
    return accounts;
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
