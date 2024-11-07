import * as readline from "node:readline/promises";
import fs from "node:fs";
import { isEmpty } from "./utils/is-empty.js";
import {
    extractKeyPair,
    isValidKeyPairOption,
} from "./utils/is-valid-key-pair-option.js";
import { printError } from "./utils/help.js";

export async function processCSV(argv) {
    const inputStream = fs.createReadStream(argv.input);
    const outStream = fs.createWriteStream(argv.output);

    const rl = readline.createInterface({
        input: inputStream,
    });

    let isHeader = true;
    let headers;

    for await (const line of rl) {
        if (isHeader) {
            headers = line.split(",");
            outStream.write(`${line}\n`);
            isHeader = false;
            continue;
        }

        if (argv.filter && !isEmpty(argv.filter)) {
            const shouldIncludeLine = applyFilter(argv.filter, headers, line);
            if (shouldIncludeLine) {
                outStream.write(`${line}\n`);
            }
        }
    }
}

function applyFilter(filter, headers, line) {
    const result = isValidKeyPairOption(filter, headers);
    if (result == 1) {
        printError("csvtransform: invalid filter option");
        return;
    }

    if (result == 2) {
        printError("csvtransform: field not found", false);
        return;
    }

    const [_, key, value] = extractKeyPair(filter);
    const fieldIndex = headers.findIndex((header) => header === key);

    const shouldIncludeLine = line.split(",")[fieldIndex] === value;
    return shouldIncludeLine;
}
