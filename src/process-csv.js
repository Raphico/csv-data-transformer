"use strict";

import * as readline from "node:readline/promises";
import fs from "node:fs";
import { isEmpty } from "./utils/is-empty.js";
import { printError } from "./utils/help.js";
import { parseKeyValuePair, validateOption } from "./utils/validate-option.js";

export async function processCSV(argv) {
    const inputStream = fs.createReadStream(argv.input);
    const outStream = fs.createWriteStream(argv.output);

    const rl = readline.createInterface({
        input: inputStream,
    });

    let isHeader = true,
        noTransformation = false,
        isFilterValid,
        columnToRemoveIndex,
        isNewColumnValid,
        isRenameValid,
        headers;

    for await (let line of rl) {
        if (isHeader) {
            headers = line.split(",");
            isHeader = false;

            [
                isFilterValid,
                isRenameValid,
                columnToRemoveIndex,
                isNewColumnValid,
            ] = validateOptions(argv, headers);

            if (isFilterValid === false) {
                printError("invalid filter value or column not found");
                return;
            }
            if (isRenameValid === false) {
                printError("invalid rename or column not found");
            }
            if (columnToRemoveIndex === -1) {
                printError("column not found");
                return;
            }
            if (isNewColumnValid === false) {
                printError("invalid '--add-column' option value");
                return;
            }

            if (columnToRemoveIndex > -1)
                headers.splice(columnToRemoveIndex, 1);
            if (isRenameValid) {
                const [, key, value] = parseKeyValuePair(argv["rename-column"]);
                headers = headers.map(function renameHeader(header) {
                    return header === key ? value : header;
                });
            }
            if (isNewColumnValid) {
                const [, key] = parseKeyValuePair(argv["add-column"]);
                headers = [...headers, key];
            }

            noTransformation = [
                isFilterValid,
                isRenameValid,
                columnToRemoveIndex,
                isNewColumnValid,
            ].every((value) => value === undefined);

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
            line = line
                .split(",")
                .filter((_, index) => index != columnToRemoveIndex)
                .join(",");
        }

        if (isNewColumnValid) {
            const [, , value] = parseKeyValuePair(argv["add-column"]);
            line = `${line},${value}`;
        }

        outStream.write(`${line}\n`);
    }

    if (noTransformation) {
        console.log(
            "Output file created with all original content as no transformation options were specified."
        );
        console.log("Try 'bfr --help' for more information.");
    }
}

function validateOptions(argv, headers) {
    let isFilterValid, columnToRemoveIndex, isNewColumnValid, isRenameValid;

    if (argv.filter && !isEmpty(argv.filter)) {
        isFilterValid = isValidFilterValue(argv.filter, headers);
    }

    if (argv["rename-column"] && !isEmpty(argv["rename-column"])) {
        isRenameValid = !validateOption({
            value: argv["rename-column"],
            allowedKeys: headers,
        });
    }

    if (argv["remove-column"] && !isEmpty(argv["remove-column"])) {
        columnToRemoveIndex = headers.findIndex(
            (header) => header === argv["remove-column"]
        );
    }

    if (argv["add-column"] && !isEmpty(argv["add-column"])) {
        isNewColumnValid = !validateOption({ value: argv["add-column"] });
    }

    return [
        isFilterValid,
        isRenameValid,
        columnToRemoveIndex,
        isNewColumnValid,
    ];
}

export function applyFilter({ filterValue, headers, line, delimiter }) {
    const record = line.split(delimiter);

    const parsedConditions = filterValue.split(" OR ").map(function (segment) {
        const parsedSegment = segment.split(" AND ").map(function (param) {
            const [_, key, value] = parseKeyValuePair(param);
            const fieldIndex = headers.findIndex((header) => header === key);

            return record[fieldIndex] === value;
        });

        return parsedSegment.every(Boolean);
    });

    return parsedConditions.some(Boolean);
}

export function isValidFilterValue(filterValue, headers) {
    const conditions = filterValue.split(/\s+(?:AND|OR)\s+/).filter(Boolean);

    const result = conditions.reduce(function (accumulator, condition) {
        return [
            ...accumulator,
            validateOption({ value: condition, allowedKeys: headers }),
        ];
    }, []);

    return result.every((value) => value == 0);
}
