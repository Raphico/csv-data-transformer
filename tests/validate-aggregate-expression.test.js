"use strict";

import { describe, expect, test } from "vitest";
import {
    isValidAggregateExpression,
    parseAggregateSyntax,
} from "../src/utils/validate-aggregate-expression.js";

describe("parseAggregateSyntax", () => {
    test("should parse formula syntax accurately", () => {
        const result = parseAggregateSyntax("sum,sales");
        expect(result).toContain("sum");
        expect(result).toContain("sales");
    });
});

describe("validateAggregateExpression", () => {
    test("should return 0 if expression is valid", () => {
        const validAggregates = ["sum", "average", "min", "max"];

        expect(
            isValidAggregateExpression({
                formula: "sum,price",
                validAggregates,
            })
        ).toBe(0);
    });

    test("should return 1 if expression is invalid", () => {
        const validAggregates = ["sum", "average", "min", "max"];

        expect(
            isValidAggregateExpression({
                formula: "sum",
                validAggregates,
            })
        ).toBe(1);

        expect(
            isValidAggregateExpression({
                formula: "hi",
                validAggregates,
            })
        ).toBe(1);
    });

    test("should return 2 if specified aggregate is not found", () => {
        const validAggregates = ["sum", "average", "min", "max"];

        expect(
            isValidAggregateExpression({
                formula: "divide,price",
                validAggregates,
            })
        ).toBe(2);
    });
});
