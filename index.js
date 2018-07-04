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
    try {
        const accounts = processData(data);
        userInstruction(accounts);
    } catch (e){
        if (e === "Stop Process") {
            console.log("Goodbye");
        } else {
            console.log("An unknown error has occured");
            console.log(e);
        }
    }
});

function processData(data) {
     const accounts = new Map();
     let rows = data.split("\n");
     rows.shift();
     rows.pop();

     const errors = new Map();

     for (let i = 0; i < rows.length; i++) {
         let row = rows[i];
         let trans = row.split(",")
         let errorMessage = "";

         if (trans.length != 5) {
             logger.error(`Wrong number of columns in row ${i}: should be 5 columns but there are ${trans.length}.`);
             errorMessage += `Wrong number of columns in row ${i}: should be 5 columns but there are ${trans.length}.\n`
         } else {
             if (isNaN(trans[4])) {
                 logger.error(`Amount in row ${i} is not a number: ${trans[4]}`);
                 errorMessage += `Amount in row ${i} is not a number: ${trans[4]}\n`;
             }
             if (!moment(trans[0], "DD-MM-YYYY").isValid()) {
                 logger.error(`Date in row ${i} is not valid: ${trans[0]}`);
                 errorMessage += `Date in row ${i} is not valid: ${trans[0]}\n`;
             }
         }
         if (errorMessage !== "") {
             errors.set(i, errorMessage);
         }
     }

     if (errors.size !== 0) {
         printErrors(errors);
         const query = readlineSync.question("Do you want to continue anyway with the remaining data? (y/N)");
         if (query.toUpperCase() !== "Y") {
             throw "Stop Process"
         }
     }
     for (let i = 0; i < rows.length; i++) {
         if (!errors.has(i)) {
             let row = rows[i];
             let trans = row.split(",")
             let transaction = new Transaction(trans);
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
    })
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
