#! /usr/bin/env node

"use strict";

import minimist from "minimist";
import { hideBin } from "./utils/hide-bin.js";
import { printError, printHelp } from "./utils/help.js";
import { isEmpty } from "./utils/is-empty.js";
import {
    isValidCSVFile,
    isValidFile,
    isValidJSONFile,
} from "./utils/check-file.js";
import { processCSV } from "./process-csv.js";

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

    if (containsNecessaryOptions(argv)) {
        processCSV(argv).catch((error) => {
            printError(`${error.message}`, false);
        });
    }
})(argv);

function containsNecessaryOptions(argv) {
    if (isEmpty(argv.input ?? "") || isEmpty(argv.output ?? "")) {
        printError("missing input or output operand");
        return false;
    }

    if (!isValidFile(argv.input) || !isValidCSVFile(argv.input)) {
        printError("input file not found or not a csv file");
        return false;
    }

    if (!isValidJSONFile(argv.output) && !isValidCSVFile(argv.output)) {
        printError("output file must be csv or json format");
        return false;
    }

    return true;
}
