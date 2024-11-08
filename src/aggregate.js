"use strict";

export function updateAggregate({
    aggregateType,
    aggregate,
    field,
    lineCount,
}) {
    switch (aggregateType) {
        case "sum":
            return aggregate + field;
        case "max":
            return Math.max(aggregate, field);
        case "min":
            return lineCount === 2 ? field : Math.min(aggregate, field);
        case "avg":
            return aggregate + field;
        default:
            return aggregate;
    }
}
