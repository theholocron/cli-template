import { beforeEach, describe, expect, it, vi } from "vitest";

import { CLIError } from "@/errors.js";

import { handler, runConfAdd } from "./add.js";

const { mockConfig, mockLog } = vi.hoisted(() => ({
	mockConfig: { get: vi.fn(), set: vi.fn() },
	mockLog: { data: vi.fn(), success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/utils", () => ({
	config: mockConfig,
	log: mockLog,
}));

beforeEach(() => {
	vi.clearAllMocks();
	process.exitCode = 0;
});

describe("runConfAdd", () => {
	it("sets a new scalar value", () => {
		mockConfig.get.mockReturnValue(null);
		const report = runConfAdd({ name: "foo", value: "bar" });
		expect(mockConfig.set).toHaveBeenCalledWith("foo", "bar");
		expect(report.status).toBe("ok");
		expect(report.key).toBe("foo");
	});

	it("appends to an existing array and deduplicates", () => {
		mockConfig.get.mockReturnValueOnce(["a", "b"]).mockReturnValueOnce(["a", "b", "c"]);
		runConfAdd({ name: "list", value: "c" });
		expect(mockConfig.set).toHaveBeenCalledWith("list", ["a", "b", "c"]);
	});

	it("does not duplicate an existing array value", () => {
		mockConfig.get.mockReturnValueOnce(["a", "b"]).mockReturnValueOnce(["a", "b"]);
		runConfAdd({ name: "list", value: "a" });
		expect(mockConfig.set).toHaveBeenCalledWith("list", ["a", "b"]);
	});

	it("merges into an existing object", () => {
		mockConfig.get.mockReturnValueOnce({ x: "1" }).mockReturnValueOnce({ x: "1", obj: "2" });
		runConfAdd({ name: "obj", value: "2" });
		expect(mockConfig.set).toHaveBeenCalledWith("obj", { x: "1", obj: "2" });
	});

	it("calls print with the result message", () => {
		mockConfig.get.mockReturnValue("bar");
		const printed: string[] = [];
		runConfAdd({ name: "key", value: "bar", print: (m) => printed.push(m) });
		expect(printed).toHaveLength(1);
		expect(printed[0]).toContain("key");
		expect(printed[0]).toContain("bar");
	});
});

describe("handler", () => {
	it("calls log.success on a successful add", () => {
		mockConfig.get.mockReturnValue("bar");
		handler({ name: "key", value: "bar" });
		expect(mockLog.success).toHaveBeenCalled();
	});

	it("calls log.error and sets exitCode on CLIError", () => {
		mockConfig.get.mockImplementation(() => {
			throw new CLIError("bad key");
		});
		handler({ name: "key", value: "val" });
		expect(mockLog.error).toHaveBeenCalledWith("conf add", "bad key");
		expect(process.exitCode).toBe(1);
	});

	it("calls log.error and sets exitCode on unexpected errors", () => {
		mockConfig.get.mockImplementation(() => {
			throw new Error("unexpected");
		});
		handler({ name: "key", value: "val" });
		expect(mockLog.error).toHaveBeenCalledWith("conf add", "Error: unexpected");
		expect(process.exitCode).toBe(1);
	});
});
