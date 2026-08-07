import { describe, expect, it } from "vitest";

import { validate } from "./utils.js";

describe("validate.isNotEmpty", () => {
	it("returns true for a non-empty string", () => {
		expect(validate.isNotEmpty("hello")).toBe(true);
	});

	it("returns an error message for an empty string", () => {
		expect(validate.isNotEmpty("")).toBe("Cannot be empty");
	});

	it("returns an error message for a whitespace-only string", () => {
		expect(validate.isNotEmpty("   ")).toBe("Cannot be empty");
	});
});
