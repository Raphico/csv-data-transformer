import { parseKeyValuePair, validateOption } from "./utils/validate-option.js";

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
