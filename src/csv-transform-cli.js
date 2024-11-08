#! /usr/bin/env node

"use strict";

import minimist from "minimist";
import { hideBin } from "./utils/hide-bin.js";
import { printError, printHelp } from "./utils/help.js";
import { processCSV } from "./process-csv.js";
import { hasNecessaryOptions } from "./validate.js";

const argv = minimist(hideBin(process.argv), {
    string: [
        "input",
        "output",
        "filter",
        "aggregate",
        "add-column",
        "remove-column",
        "rename-column",
        "modify-column",
        "delimiter",
    ],
    default: {
        delimiter: ",",
    },
    boolean: ["help"],
    alias: {
        h: "help",
        i: "input",
        o: "output",
        f: "filter",
        a: "aggregate",
        d: "delimiter",
    },
});

(function main(argv) {
    if (argv.help) {
        printHelp();
        return;
    }

    if (hasNecessaryOptions(argv)) {
        processCSV(argv).catch((error) => {
            printError(`${error.message}`, false);
            console.error(error);
        });
    }
})(argv);
