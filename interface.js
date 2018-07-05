const readlineSync = require("readline-sync");

const parseInput = require('./inputFile.js');
const processData = require('./bank.js');

function userInstruction(accounts) {
    let command = readlineSync.question("Enter command:");
    if (command.toUpperCase() === "Q" || command.toUpperCase() ===  "QUIT") {
        return false;
    } else if ((command.slice(0,11)).toUpperCase() === "IMPORT FILE") {
        const transactions = parseInput(command.slice(12));
        processData(transactions, accounts);
    } else if (command.toUpperCase() === "LIST ALL") {
        //console.log(accounts);
        console.log(`There are ${accounts.size} accounts`);
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
    return true;
}

module.exports = userInstruction;