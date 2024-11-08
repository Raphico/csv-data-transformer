"use strict";

import * as readline from "node:readline/promises";
import fs from "node:fs";
import { printError } from "./utils/help.js";
import { parseKeyValuePair } from "./utils/validate-option.js";
import { parseAggregateSyntax } from "./utils/validate-aggregate-expression.js";
import { checkAndHandleError, validateOptions } from "./validate.js";
import { applyFilter } from "./filter.js";
import { updateAggregate } from "./aggregate.js";
import { isValidJSONFile } from "./utils/check-file.js";

export async function processCSV(argv) {
    const inputStream = fs.createReadStream(argv.input);
    let outStream = isValidJSONFile(argv.output)
        ? []
        : fs.createWriteStream(argv.output);

    const rl = readline.createInterface({
        input: inputStream,
    });

    let isHeader = true,
        noTransformation = false,
        isFilterValid,
        columnToRemoveIndex,
        isNewColumnValid,
        isRenameValid,
        isAggregateValid,
        aggregateColumnIndex,
        aggregate = 0,
        lineCount = 0,
        aggregateType,
        headers;

    for await (let line of rl) {
        lineCount++;
        if (isHeader) {
            headers = line.split(argv.delimiter);
            isHeader = false;

            [
                isFilterValid,
                isRenameValid,
                columnToRemoveIndex,
                isNewColumnValid,
                isAggregateValid,
            ] = validateOptions(argv, headers);

            if (
                checkAndHandleError({
                    isFilterValid,
                    columnToRemoveIndex,
                    isNewColumnValid,
                    isRenameValid,
                    isAggregateValid,
                })
            ) {
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
            if (isAggregateValid) {
                const [, type, column] = parseAggregateSyntax(argv.aggregate);
                aggregateType = type;
                aggregateColumnIndex = headers.findIndex(
                    (header) => header === column
                );
            }

            noTransformation = [
                isFilterValid,
                isRenameValid,
                columnToRemoveIndex,
                isNewColumnValid,
                isAggregateValid,
            ].every((value) => value === undefined);

            !isValidJSONFile(argv.output) &&
                outStream.write(`${headers.join(argv.delimiter)}\n`);

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
                .split(argv.delimiter)
                .filter((_, index) => index != columnToRemoveIndex)
                .join(argv.delimiter);
        }

        if (isNewColumnValid) {
            const [, , value] = parseKeyValuePair(argv["add-column"]);
            line = `${line}${argv.delimiter}${value}`;
        }

        if (isAggregateValid) {
            const field = Number(
                line.split(argv.delimiter)[aggregateColumnIndex]
            );
            if (isNaN(field)) {
                printError(
                    `can't calculate ${aggregateType} aggregate on ${headers[aggregateColumnIndex]}`
                );
                return;
            }
            aggregate = updateAggregate({
                aggregateType,
                aggregate,
                field,
                lineCount,
            });
        }

        if (isValidJSONFile(argv.output)) {
            const row = line.split(",");
            const rowObject = headers.reduce(function getRowObject(
                accumulator,
                header,
                index
            ) {
                accumulator[header] = row[index];
                return accumulator;
            },
            {});
            outStream = [...outStream, rowObject];
        } else {
            outStream.write(`${line}\n`);
        }
    }

    if (isValidJSONFile(argv.output)) {
        await fs.promises.writeFile(
            argv.output,
            JSON.stringify(outStream, null, 4)
        );
    }

    if (noTransformation) {
        console.log(
            "Output file created with all original content as no transformation options were specified."
        );
        console.log("Try 'bfr --help' for more information.");
    }

    if (isAggregateValid) {
        aggregate =
            aggregateType === "avg" ? aggregate / (lineCount - 1) : aggregate;
        console.log(`aggregate: ${aggregate}`);
    }
}
