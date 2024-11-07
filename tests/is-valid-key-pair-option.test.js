"use strict";

import { describe, expect, test } from "vitest";
import { isValidKeyPairOption } from "../src/utils/is-valid-key-pair-option.js";

describe("isValidKeyPairOption", () => {
    test("should return 0 if option is valid", () => {
        expect(
            isValidKeyPairOption("status=active", [
                "name",
                "status",
                "country",
                "sales",
            ])
        ).toBe(0);

        expect(
            isValidKeyPairOption("status=active AND name=john doe", [
                "name",
                "status",
                "country",
                "sales",
            ])
        ).toBe(0);
    });

    test("should return 1 if option is invalid", () => {
        expect(
            isValidKeyPairOption("status", [
                "name",
                "status",
                "country",
                "sales",
            ])
        ).toBe(1);

        expect(
            isValidKeyPairOption("status,active", [
                "name",
                "status",
                "country",
                "sales",
            ])
        ).toBe(1);
    });

    test("should return 2 if option is not in allowedKeys", () => {
        expect(
            isValidKeyPairOption("age=30", [
                "name",
                "status",
                "country",
                "sales",
            ])
        ).toBe(2);
    });

    test("should throw if invalid option or allowKeys", () => {
        expect(() => isValidKeyPairOption("status=active")).toThrow();
        expect(() => isValidKeyPairOption()).toThrow();
    });
});
