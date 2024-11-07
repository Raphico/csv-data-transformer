"use strict";

/**
 * @typedef {Object} Option
 * @property {string} value - The option value specified by the user in the format "key=string"
 * @property {string[] | undefined} allowedKeys - An array of valid keys
 */

/**
 * Validates a key-value option
 *
 * This function checks that an option string follows the correct syntax
 * (`key=value`), and that the specified key exists in the provided list of
 * allowed keys (e.g., CSV headers or other allowed fields).
 *
 * @param {Option} option
 * @returns {0 | 1 | 2} - Returns 1 if option is invalid, 2 if option is not in allowed keys, and 0 if valid.
 */
export function validateOption({ value, allowedKeys }) {
    if (!value) {
        throw new Error("value is not defined");
    }

    const match = parseKeyValuePair(value);
    if (!match) {
        return 1;
    }

    const [_, key] = match;
    if (allowedKeys && !allowedKeys.includes(key)) {
        return 2;
    }

    return 0;
}

export function parseKeyValuePair(value) {
    return /^(\w+)=([\w\s]+)$/.exec(value);
}
