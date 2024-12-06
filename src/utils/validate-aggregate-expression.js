/**
 * @typedef {Object} AggregateExpression
 * @property {string} formula - The calculation formula, e.g., 'sum,sales' or 'price,*1.2'.
 * @property {string[] | undefined} validAggregates - A comma-separated list of allowed operators and functions, e.g., 'sum, average, min, max'.
 */
/**
 * Checks the validity of a calculation expression.
 *
 * This function verifies that a calculation formula follows the correct syntax (`operation,parameter`)
 * and uses only allowed operators.
 *
 * @param {AggregateExpression} expressionConfig - The object containing the formula and valid operators.
 * @returns {1 | 0 | 2} - Returns `0` if the formula is valid; if invalid returns `1` if aggregate function is not defined `2`.
 * @throws {Error} - Throws an error if `formula` or `validAggregates` is not defined.
 */
export function isValidAggregateExpression({ formula, validAggregates }) {
    if (!formula || !validAggregates) {
        throw new Error("Formula or valid aggregates are not defined.");
    }

    const match = parseAggregateSyntax(formula);
    if (!match) {
        return 1;
    }

    const [, type] = match;

    if (!validAggregates.includes(type)) {
        return 2;
    }

    return 0;
}

/**
 * Parses and validates the basic syntax of a formula string.
 *
 * This function checks if the formula follows the pattern `type,column`, where `type` and `column`
 * are alphanumeric identifiers.
 *
 * @param {string} formula - The calculation formula to validate.
 * @returns {Array|null} - Returns an array of matched groups if syntax is valid; otherwise, `null`.
 */
export function parseAggregateSyntax(formula) {
    return /^(\w+),(\w+)$/.exec(formula);
}
