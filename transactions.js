class Transaction {
    constructor(data) {
        this.date = data[0];
        this.from = data[1];
        this.to = data[2];
        this.narrative = data[3];
        this.amount = parseFloat(data[4]);
    }
}

module.exports = Transaction;