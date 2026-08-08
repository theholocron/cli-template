import * as fs from "node:fs";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { writeEnv } from "./env.js";

vi.mock("node:fs");

beforeEach(() => {
	vi.clearAllMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("writeEnv", () => {
	it("writes new env vars to the file", () => {
		vi.spyOn(fs, "existsSync").mockReturnValue(false);
		const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

		const [err, ok] = writeEnv({ FOO: "bar" });

		expect(err).toBeNull();
		expect(ok).toBe(true);
		expect(writeSpy).toHaveBeenCalledWith(expect.any(String), "FOO=bar", { flag: "w+" });
	});

	it("merges with existing env vars", () => {
		vi.spyOn(fs, "existsSync").mockReturnValue(true);
		vi.spyOn(fs, "readFileSync").mockReturnValue("EXISTING=value\n");
		const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

		writeEnv({ NEW: "thing" });

		const written = writeSpy.mock.calls[0]?.[1] as string;
		expect(written).toContain("EXISTING=value");
		expect(written).toContain("NEW=thing");
	});

	it("overwrites an existing key with the new value", () => {
		vi.spyOn(fs, "existsSync").mockReturnValue(true);
		vi.spyOn(fs, "readFileSync").mockReturnValue("KEY=old\n");
		const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

		writeEnv({ KEY: "new" });

		const written = writeSpy.mock.calls[0]?.[1] as string;
		expect(written).toContain("KEY=new");
		expect(written).not.toContain("KEY=old");
	});

	it("returns an error when writeFileSync throws", () => {
		vi.spyOn(fs, "existsSync").mockReturnValue(false);
		vi.spyOn(fs, "writeFileSync").mockImplementation(() => {
			throw new Error("disk full");
		});

		const [err, ok] = writeEnv({ X: "y" });

		expect(ok).toBe(false);
		expect(err).toBeInstanceOf(Error);
		expect(err?.message).toBe("disk full");
	});
});
