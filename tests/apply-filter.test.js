"use strict";

import { applyFilter } from "../src/process-csv.js";
import { describe, test, expect } from "vitest";

describe("applyFilter", () => {
    const headers = ["status", "age", "name"];
    const delimiter = ",";

    test("should return true when a single filter condition matches", () => {
        const line = "active,30,john";
        const filterValue = "status=active";

        const result = applyFilter({ filterValue, headers, line, delimiter });
        expect(result).toBe(true);
    });

    test("should return true when multiple AND conditions match", () => {
        const line = "active,30,john";
        const filterValue = "status=active AND age=30";

        const result = applyFilter({ filterValue, headers, line, delimiter });
        expect(result).toBe(true);
    });

    test("should return false when an AND condition does not match", () => {
        const line = "active,30,jane";
        const filterValue = "status=active AND name=john";

        const result = applyFilter({ filterValue, headers, line, delimiter });
        expect(result).toBe(false);
    });

    test("should return true when at least one OR condition matches", () => {
        const line = "inactive,25,john";
        const filterValue = "status=active OR age=25";

        const result = applyFilter({ filterValue, headers, line, delimiter });
        expect(result).toBe(true);
    });

    test("should return false when no OR conditions match", () => {
        const line = "inactive,25,jane";
        const filterValue = "status=active OR name=john";

        const result = applyFilter({ filterValue, headers, line, delimiter });
        expect(result).toBe(false);
    });

    test("should handle complex conditions with both AND and OR", () => {
        const line = "active,30,john";
        const filterValue = "status=inactive OR status=active AND age=30";

        const result = applyFilter({ filterValue, headers, line, delimiter });
        expect(result).toBe(true);
    });

    test("should handle cases with no matching headers", () => {
        const line = "active,30,jane";
        const filterValue = "unknown=abc";

        const result = applyFilter({ filterValue, headers, line, delimiter });
        expect(result).toBe(false);
    });
});
