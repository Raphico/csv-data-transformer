"use strict";

import { describe, expect, test } from "vitest";
import { isValidKeyPairOption } from "../src/utils/is-valid-key-pair-option.js";

describe("isValidKeyPairOption", () => {
    test("should return 0 if option is valid", () => {
        expect(
            isValidKeyPairOption({
                option: "status=active",
                allowedKeys: ["name", "status", "country", "sales"],
            })
        ).toBe(0);

        expect(
            isValidKeyPairOption({
                option: "status=active AND name=john doe",
                allowedKeys: ["name", "status", "country", "sales"],
            })
        ).toBe(0);

        expect(
            isValidKeyPairOption({
                option: "status=active AND name=john doe",
            })
        ).toBe(0);
    });

    test("should return 1 if option is invalid", () => {
        expect(
            isValidKeyPairOption({
                option: "status",
                allowedKeys: ["name", "status", "country", "sales"],
            })
        ).toBe(1);

        expect(
            isValidKeyPairOption({
                option: "status,active",
            })
        ).toBe(1);
    });

    test("should return 2 if option is not in allowedKeys", () => {
        expect(
            isValidKeyPairOption({
                option: "age=30",
                allowedKeys: ["name", "status", "country", "sales"],
            })
        ).toBe(2);
    });

    test("should throw if invalid option or allowKeys", () => {
        expect(() => isValidKeyPairOption()).toThrow();
        expect(() => isValidKeyPairOption({})).toThrow();
    });
});
