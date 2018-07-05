const readlineSync = require("readline-sync");

function userInstruction(accounts) {
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
            console.log("Account name not recognised");
        }
    } else {console.log("Command not recognised")}

}

module.exports = userInstruction;