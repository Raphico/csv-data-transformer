import { describe, expect, test } from "vitest";
import { isValidFilterValue } from "../src/filter.js";

describe("isValidFilterValue", () => {
    const headers = ["name", "status", "country", "sales"];

    test("should return true if filter value is valid", () => {
        expect(isValidFilterValue("status=active", headers)).toBe(true);

        expect(
            isValidFilterValue("status=active AND country=USA", headers)
        ).toBe(true);

        expect(
            isValidFilterValue("status=active OR country=USA", headers)
        ).toBe(true);

        expect(
            isValidFilterValue(
                "status=active OR country=USA AND sales=1000",
                headers
            )
        ).toBe(true);
    });

    test("should return false if filter value is not valid", () => {
        expect(isValidFilterValue("age=30", headers)).toBe(false);

        expect(isValidFilterValue("status=active AND age=30", headers)).toBe(
            false
        );

        expect(isValidFilterValue("status", headers)).toBe(false);
    });
});
