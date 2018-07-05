const log4js = require('log4js');

const parseInput = require('./inputFile.js');
const processData = require('./bank.js');
const userInstruction = require('./interface.js');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

const logger = log4js.getLogger("index.js");

logger.info("Program has started.");

const accounts = new Map();
var run = true;
while (run) {
    try {
        run = userInstruction(accounts);
    } catch (e){
        if (e === "Stop Process") {
            console.log("Goodbye");
        } else {
            console.log(e);
        }
        run = false;
    }
}

