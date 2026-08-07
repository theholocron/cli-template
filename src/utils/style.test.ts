import { describe, expect, it } from "vitest";

import { style } from "./style.js";

describe("style", () => {
	it("success prefixes with ✓", () => {
		expect(style.success("done")).toContain("✓");
		expect(style.success("done")).toContain("done");
	});

	it("warn prefixes with ⚠", () => {
		expect(style.warn("careful")).toContain("⚠");
		expect(style.warn("careful")).toContain("careful");
	});

	it("fail prefixes with ✗", () => {
		expect(style.fail("bad")).toContain("✗");
		expect(style.fail("bad")).toContain("bad");
	});

	it("step prefixes with →", () => {
		expect(style.step("running")).toContain("→");
		expect(style.step("running")).toContain("running");
	});

	it("hint returns a string containing the message", () => {
		expect(style.hint("tip")).toContain("tip");
	});

	it("dim returns a string containing the message", () => {
		expect(style.dim("muted")).toContain("muted");
	});

	it("header returns a string containing the message", () => {
		expect(style.header("Title")).toContain("Title");
	});
});
