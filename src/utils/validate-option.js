/**
 * @typedef {Object} KeyValueOption
 * @property {string} value - The option string specified by the user, formatted as "key=value".
 * @property {string[] | undefined} allowedKeys - An optional array of valid keys.
 */

/**
 * Validates a key-value option string.
 *
 * This function checks that an option string adheres to the correct syntax (`key=value`) and verifies
 * that the specified key is present in the provided list of allowed keys (such as CSV headers or other allowed fields).
 *
 * @param {KeyValueOption} option - The option object containing the key-value string and the allowed keys.
 * @returns {0 | 1 | 2} - Returns 0 if the option is valid, 1 if the syntax is invalid, and 2 if the key is not in allowed keys.
 * @throws {Error} - Throws an error if `value` is not defined.
 */
export function validateOption({ value, allowedKeys }) {
    if (!value) {
        throw new Error("The value property is not defined.");
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

/**
 * Parses a key-value pair string.
 *
 * This function checks if a string is formatted as `key=value`, where `key` and `value` are alphanumeric
 * strings. It allows spaces in the value portion.
 *
 * @param {string} value - The key-value pair string to parse.
 * @returns {Array|null} - Returns an array of matched groups if syntax is valid; otherwise, returns `null`.
 */
export function parseKeyValuePair(value) {
    return /^(\w+)=([\w\s]+)$/.exec(value);
}
