const readlineSync = require('readline-sync');
const fs = require('fs');

class Account {
    constructor(owner, total, transactionsTo, transactionsFrom) {
        this.owner = owner;
        this.total = total;
        this.transactionsTo = transactionsTo;
        this.transactionsFrom = transactionsFrom;
    }
}

class Transaction {
    constructor(data) {
        this.date = data[0];
        this.from = data[1];
        this.to = data[2];
        this.narrative = data[3];
        this.amount = parseFloat(data[4]);
    }
}

fs.readFile("Transactions2014.csv", 'utf8',  function (err, data) {
    let rows = data.split("\n");
    rows.shift();
    let accounts = new Map();
    rows.forEach(function (row) {
        let trans = row.split(",");
        let transaction = new Transaction(trans);
        checkAndAddAccount(transaction.from, accounts);
        checkAndAddAccount(transaction.to, accounts);
        processToTransaction(transaction, accounts);
        processFromTransaction(transaction, accounts);

    })
    console.log(accounts);
});


function checkAndAddAccount(name, accounts) {
    if (!accounts.has(name)) {
        accounts.set(name, new Account(name, 0, [], []));
    }
}

function processToTransaction(transaction, accounts) {
    let account = accounts.get(transaction.to);
    account.total += transaction.amount;
    account.transactionsTo.push(transaction);
}

function processFromTransaction(transaction, accounts) {
    let account = accounts.get(transaction.from);
    account.total -= transaction.amount;
    account.transactionsFrom.push(transaction);
}