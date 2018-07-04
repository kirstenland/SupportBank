const moment = require("moment");

class Transaction {
    constructor(data) {
        this.date = moment(data[0], "DD-MM-YYYY");
        this.from = data[1];
        this.to = data[2];
        this.narrative = data[3];
        this.amount = parseFloat(data[4]);
    }

    printSelf() {
        console.log("Date: "+this.date.format("DD-MM-YYYY"));
        console.log("Narrative: " + this.narrative + "\n");
    }
}

module.exports = Transaction;