import { describe, expect, it } from "vitest";

import { str } from "./string.js";

describe("str.toArray", () => {
	it("wraps a string in an array", () => {
		expect(str.toArray("foo")).toEqual(["foo"]);
	});

	it("returns an array as-is", () => {
		expect(str.toArray(["foo", "bar"])).toEqual(["foo", "bar"]);
	});
});

describe("str.toBoolean", () => {
	it('returns true for "true"', () => {
		expect(str.toBoolean("true")).toBe(true);
	});

	it("returns false for any other string", () => {
		expect(str.toBoolean("false")).toBe(false);
		expect(str.toBoolean("1")).toBe(false);
		expect(str.toBoolean("")).toBe(false);
	});

	it("returns false for undefined", () => {
		expect(str.toBoolean(undefined)).toBe(false);
	});
});
