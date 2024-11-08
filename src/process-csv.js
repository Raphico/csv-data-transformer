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

    let isHeader = true,
        isFilterValid,
        columnToRemoveIndex,
        noTransformation = false;
    let headers;

    for await (const line of rl) {
        if (isHeader) {
            headers = line.split(",");
            isHeader = false;

            [isFilterValid, columnToRemoveIndex] = validateOptions(
                argv,
                headers
            );

            if (isFilterValid === false) {
                printError("invalid filter value or column not found");
                return;
            }

            if (columnToRemoveIndex === -1) {
                printError("column not found");
                return;
            }

            if (columnToRemoveIndex > -1)
                headers.splice(columnToRemoveIndex, 1);

            noTransformation =
                isFilterValid === undefined &&
                columnToRemoveIndex === undefined;

            outStream.write(`${headers.join(",")}\n`);

            continue;
        }

        if (isFilterValid) {
            const shouldIncludeLine = applyFilter({
                filterValue: argv.filter,
                headers,
                line,
                delimiter: argv.delimiter,
            });

            if (!shouldIncludeLine) continue;
        }

        if (columnToRemoveIndex > -1) {
            const newLine = line
                .split(",")
                .filter((_, index) => index != columnToRemoveIndex)
                .join(",");
            outStream.write(`${newLine}\n`);
        }

        if (noTransformation) {
            outStream.write(`${line}\n`);
        }
    }

    if (noTransformation) {
        console.log(
            "Output file created with all original content as no transformation options were specified."
        );
        console.log("Try 'bfr --help' for more information.");
    }
}

export function validateOptions(argv, headers) {
    let isFilterValid, columnToRemoveIndex;

    if (argv.filter && !isEmpty(argv.filter)) {
        isFilterValid = isValidFilterValue(argv.filter, headers);
    }

    if (argv["remove-column"] && !isEmpty(argv["remove-column"])) {
        columnToRemoveIndex = headers.findIndex(
            (header) => header === argv["remove-column"]
        );
    }

    return [isFilterValid, columnToRemoveIndex];
}
