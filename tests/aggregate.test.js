import { describe, test, expect } from "vitest";
import { updateAggregate } from "../src/aggregate";

describe("updateAggregate function", () => {
    test("should correctly calculate sum", () => {
        const result = updateAggregate({
            aggregateType: "sum",
            aggregate: 10,
            field: 5,
            lineCount: 3,
        });
        expect(result).toBe(15);
    });

    test("should correctly calculate max", () => {
        const result = updateAggregate({
            aggregateType: "max",
            aggregate: 10,
            field: 15,
            lineCount: 3,
        });
        expect(result).toBe(15);
    });

    test("should keep max unchanged if field is lower", () => {
        const result = updateAggregate({
            aggregateType: "max",
            aggregate: 20,
            field: 15,
            lineCount: 3,
        });
        expect(result).toBe(20);
    });

    test("should correctly calculate min when lineCount is not 2", () => {
        const result = updateAggregate({
            aggregateType: "min",
            aggregate: 10,
            field: 5,
            lineCount: 3,
        });
        expect(result).toBe(5);
    });

    test("should set min to field when lineCount is 2", () => {
        const result = updateAggregate({
            aggregateType: "min",
            aggregate: 10,
            field: 5,
            lineCount: 2,
        });
        expect(result).toBe(5);
    });

    test("should correctly accumulate for avg", () => {
        const result = updateAggregate({
            aggregateType: "avg",
            aggregate: 15,
            field: 5,
            lineCount: 3,
        });
        expect(result).toBe(20);
    });

    test("should return aggregate unchanged for unsupported type", () => {
        const result = updateAggregate({
            aggregateType: "unknown",
            aggregate: 10,
            field: 5,
            lineCount: 3,
        });
        expect(result).toBe(10);
    });
});
