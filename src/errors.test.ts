import { describe, expect, it } from "vitest";

import { CLIError } from "./errors.js";

describe("CLIError", () => {
	it("is an instance of Error", () => {
		expect(new CLIError("oops")).toBeInstanceOf(Error);
	});

	it("has name CLIError", () => {
		expect(new CLIError("oops").name).toBe("CLIError");
	});

	it("carries the message", () => {
		expect(new CLIError("something went wrong").message).toBe("something went wrong");
	});
});
