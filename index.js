const readlineSync = require('readline-sync');
const fs = require('fs');
const Account = require('./accounts.js');
const Transaction = require('./transactions.js');

fs.readFile("Transactions2014.csv", 'utf8',  function (err, data) {
    const accounts = processData(data);
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
            console.log("account name not recognised");
        }
    } else {console.log("Command not recognised")}                                                             
    
});

function processData(data) {
     const accounts = new Map();
     let rows = data.split("\n");
     rows.shift();
     rows.pop();

     rows.forEach(function (row) {
         let trans = row.split(",");
         let transaction = new Transaction(trans);
         //console.log(transaction);
         checkAndAddAccount(transaction.from, accounts);
         checkAndAddAccount(transaction.to, accounts);
         (accounts.get(transaction.to)).processToTransaction(transaction);
         (accounts.get(transaction.from)).processFromTransaction(transaction);

    });
    //console.log(accounts);
    return accounts;
}


function checkAndAddAccount(name, accounts) {
    if (!accounts.has(name)) {
        accounts.set(name, new Account(name, 0, [], []));
    }
}
