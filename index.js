const readlineSync = require('readline-sync');
const fs = require('fs');
const Account = require('./accounts.js');
const Transaction = require ('./transactions.js');

fs.readFile("Transactions2014.csv", 'utf8',  function (err, data) {
    let rows = data.split("\n");
    rows.shift();
    let accounts = new Map();
    rows.forEach(function (row) {
        let trans = row.split(",");
        let transaction = new Transaction(trans);
        checkAndAddAccount(transaction.from, accounts);
        checkAndAddAccount(transaction.to, accounts);
        (accounts.get(transaction.to)).processToTransaction(transaction);
        (accounts.get(transaction.from)).processFromTransaction(transaction);

    })
    console.log(accounts);
});


function checkAndAddAccount(name, accounts) {
    if (!accounts.has(name)) {
        accounts.set(name, new Account(name, 0, [], []));
    }
}