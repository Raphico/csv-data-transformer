"use strict";

/**
 * @typedef {Object} Option
 * @property {string} option - The option condition specified by the user in the format "key=string" or with multiple conditions separated by "AND"
 * @property {string[] | undefined} allowedKeys - An array of valid keys
 */

/**
 * validates a key-value option
 *
 * This function checks that an option string follows the correct syntax
 * (`key=value`), that the specified key exists in the provided list of
 * allowed keys (e.g., CSV headers or other allowed fields), and optionally,
 * that the values meet specific requirements.
 *
 * @param {Option} - option
 * @returns {0 | 1 | 2} - returns 1 if option is invalid, 2 if option is not in allowed keys, and 0 if valid
 */
export function isValidKeyPairOption({ option, allowedKeys }) {
    if (!option) {
        throw new Error("invalid arguments");
    }

    const validKeyPair = /^(\w+)=([\w\s]+)$/;

    for (let part of option.split(" AND ")) {
        const match = validKeyPair.exec(part);

        if (!match) {
            return 1;
        }

        const [_, key] = match;

        if (allowedKeys && !allowedKeys.includes(key)) {
            return 2;
        }
    }

    return 0;
}

export function extractKeyPair(keyPair) {
    return /^(\w+)=([\w\s]+)$/.exec(keyPair);
}
