import { printError } from "./utils/help.js";
import { isEmpty } from "./utils/is-empty.js";
import { isValidAggregateExpression } from "./utils/validate-aggregate-expression.js";
import { validateOption } from "./utils/validate-option.js";
import {
    isValidCSVFile,
    isValidFile,
    isValidJSONFile,
} from "./utils/check-file.js";
import { isValidFilterValue } from "./filter.js";

export function hasNecessaryOptions(argv) {
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

export function checkAndHandleError({
    isFilterValid,
    isRenameValid,
    columnToRemoveIndex,
    isNewColumnValid,
    isAggregateValid,
}) {
    if (isFilterValid === false) {
        printError("invalid filter value or column not found");
        return true;
    }
    if (isRenameValid === false) {
        printError("invalid rename or column not found");
        return true;
    }
    if (columnToRemoveIndex === -1) {
        printError("column not found");
        return true;
    }
    if (isNewColumnValid === false) {
        printError("invalid '--add-column' option value");
        return true;
    }
    if (isAggregateValid === false) {
        printError("invalid aggregate option");
        return true;
    }

    return false;
}

export function validateOptions(argv, headers) {
    let isFilterValid,
        columnToRemoveIndex,
        isNewColumnValid,
        isRenameValid,
        isAggregateValid;

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

    if (argv.aggregate && !isEmpty(argv.aggregate)) {
        isAggregateValid = !isValidAggregateExpression({
            formula: argv.aggregate,
            validAggregates: ["sum", "min", "max", "avg"],
        });
    }

    return [
        isFilterValid,
        isRenameValid,
        columnToRemoveIndex,
        isNewColumnValid,
        isAggregateValid,
    ];
}
