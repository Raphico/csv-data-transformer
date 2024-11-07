"use strict";

import { describe, expect, test } from "vitest";
import { validateOption } from "../src/utils/validate-option.js";

describe("validateOption", () => {
    test("should return 0 if option value is valid", () => {
        expect(
            validateOption({
                value: "status=active",
                allowedKeys: ["name", "status", "country", "sales"],
            })
        ).toBe(0);

        expect(
            validateOption({
                value: "name=john doe",
                allowedKeys: ["name", "status", "country", "sales"],
            })
        ).toBe(0);

        expect(
            validateOption({
                value: "status=active",
            })
        ).toBe(0);
    });

    test("should return 1 if option value is invalid", () => {
        expect(
            validateOption({
                value: "status",
                allowedKeys: ["name", "status", "country", "sales"],
            })
        ).toBe(1);

        expect(
            validateOption({
                value: "status,active",
            })
        ).toBe(1);
    });

    test("should return 2 if option value is not in allowedKeys", () => {
        expect(
            validateOption({
                value: "age=30",
                allowedKeys: ["name", "status", "country", "sales"],
            })
        ).toBe(2);
    });

    test("should throw if invalid option value or allowKeys", () => {
        expect(() => validateOption()).toThrow();
        expect(() => validateOption({})).toThrow();
    });
});
