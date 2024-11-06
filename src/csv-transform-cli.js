#! /usr/bin/env node

"use strict";

import minimist from "minimist";
import { hideBin } from "./utils/hide-bin.js";
import { printError, printHelp } from "./utils/help.js";

const argv = minimist(hideBin(process.argv), {
    string: [],
    boolean: ["help"],
    alias: {
        h: "help",
    },
});

if (argv.help) {
    printHelp();
} else {
    printError("csvtransform: usage error");
}
