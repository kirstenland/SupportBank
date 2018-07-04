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
}

module.exports = Account;