const moment = require("moment");

class Transaction {
    constructor(date, from, to, narrative, amount) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = parseFloat(amount);
    }

    printSelf() {
        console.log("Date: "+this.date.format("DD-MM-YYYY"));
        console.log("Narrative: " + this.narrative + "\n");
    }
}

module.exports = Transaction;