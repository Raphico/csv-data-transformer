"use strict";

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
            const shouldIncludeLine = applyFilter(
                argv.filter,
                headers,
                line,
                argv.delimiter
            );
            shouldIncludeLine && outStream.write(`${line}\n`);
        }
    }
}

function applyFilter(filterCondition, headers, line, delimiter) {
    const validationStatus = isValidKeyPairOption({
        option: filterCondition,
        allowedKeys: headers,
    });
    if (validationStatus == 1) {
        printError("csvtransform: invalid filter option");
        return;
    }

    if (validationStatus == 2) {
        printError("csvtransform: field not found", false);
        return;
    }

    const record = line.split(delimiter);

    const parsedConditions = filterCondition
        .split(" AND ")
        .map(function (param) {
            const [_, key, value] = extractKeyPair(param);
            const fieldIndex = headers.findIndex((header) => header === key);

            return record[fieldIndex] === value;
        });

    return parsedConditions.every(Boolean);
}
