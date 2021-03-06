class Account {
    constructor(owner) {
        this.owner = owner;
        this.total = 0;
        this.transactionsTo = [];
        this.transactionsFrom = [];
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
        console.log(`Name: ${this.owner}`);
        console.log("Total: " + (this.total).toFixed(2) + "\n");
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