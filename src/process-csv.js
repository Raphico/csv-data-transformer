"use strict";

import * as readline from "node:readline/promises";
import fs from "node:fs";
import { isEmpty } from "./utils/is-empty.js";
import { printError } from "./utils/help.js";
import { applyFilter, isValidFilterValue } from "./filter.js";

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
            if (!isValidFilterValue(argv.filter, headers)) {
                printError("invalid filter value or field not found");
                return;
            }

            const shouldIncludeLine = applyFilter({
                filterValue: argv.filter,
                headers,
                line,
                delimiter: argv.delimiter,
            });

            shouldIncludeLine && outStream.write(`${line}\n`);
        }
    }
}
