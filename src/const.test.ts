import { describe, expect, it } from "vitest";

import { __cmddir, HOME, OS, SYSTEM_IGNORED_FOLDERS } from "./const.js";

describe("constants", () => {
	it("HOME is a non-empty string", () => {
		expect(typeof HOME).toBe("string");
		expect(HOME.length).toBeGreaterThan(0);
	});

	it("OS matches process.platform", () => {
		expect(OS).toBe(process.platform);
	});

	it("SYSTEM_IGNORED_FOLDERS contains expected entries", () => {
		expect(SYSTEM_IGNORED_FOLDERS).toContain("Library");
		expect(SYSTEM_IGNORED_FOLDERS).toContain("Applications");
	});

	it("__cmddir resolves a path relative to the module", () => {
		const result = __cmddir("./commands");
		expect(result).toContain("commands");
	});
});
