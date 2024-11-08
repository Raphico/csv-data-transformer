"use strict";

import { describe, expect, test } from "vitest";
import { isEmpty } from "../src/utils/is-empty.js";

describe("isEmpty", () => {
    test("should return true if string is empty", () => {
        expect(isEmpty("")).toBe(true);
    });

    test("should return true if string contains whitespace", () => {
        expect(isEmpty("    ")).toBe(true);
    });

    test("should throw if string is undefined", () => {
        expect(() => isEmpty()).toThrow();
    });
});
