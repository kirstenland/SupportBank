class Account {
    constructor(owner, total, transactionsTo, transactionsFrom) {
        this.owner = owner;
        this.total = total;
        this.transactionsTo = transactionsTo;
        this.transactionsFrom = transactionsFrom;
    }

    processToTransaction(transaction) {
        this.total += transaction.amount;
        this.transactionsTo.push(transaction);
    }

    processFromTransaction(transaction) {
        this.total -= transaction.amount;
        this.transactionsFrom.push(transaction);
    }

    printNameAndTotal(){
        console.log("Name: " + this.owner);
        console.log("Total: " + this.total);
    }

    printTransactions(){
        this.printNameAndTotal();
        console.log("\nTransactions out: ");
        this.transactionsFrom.forEach(function(transaction) {transaction.printSelf();});
        console.log("Transactions in: ");
        this.transactionsTo.forEach(function(transaction) {transaction.printSelf();});
    }
}

module.exports = Account;