import { beforeEach, describe, expect, it, vi } from "vitest";

import { CLIError } from "@/errors.js";

import { handler, runConfView } from "./view.js";

const { mockConfig, mockLog } = vi.hoisted(() => ({
	mockConfig: {
		get: vi.fn(),
		store: { theme: "dark", debug: false } as Record<string, unknown>,
	},
	mockLog: { data: vi.fn(), error: vi.fn() },
}));

vi.mock("@/utils", () => ({
	config: mockConfig,
	log: mockLog,
	str: {
		toArray: (v: string | string[]) => (Array.isArray(v) ? v : [v]),
	},
}));

beforeEach(() => {
	vi.clearAllMocks();
	mockConfig.store = { theme: "dark", debug: false };
	process.exitCode = 0;
});

describe("runConfView", () => {
	it("returns all config when no name given", () => {
		const report = runConfView({});
		expect(report.status).toBe("ok");
		expect(report.value).toEqual({ theme: "dark", debug: false });
	});

	it("calls print with all config when no name given", () => {
		const printed: unknown[] = [];
		runConfView({ print: (v) => printed.push(v) });
		expect(printed[0]).toEqual({ theme: "dark", debug: false });
	});

	it("returns only the requested keys when name is given", () => {
		mockConfig.get.mockImplementation((key: string) => (key === "theme" ? "dark" : undefined));
		const report = runConfView({ name: ["theme"] });
		expect(report.status).toBe("ok");
		expect(report.value).toEqual({ theme: "dark" });
	});

	it("calls print with the requested keys subset", () => {
		mockConfig.get.mockReturnValue("dark");
		const printed: unknown[] = [];
		runConfView({ name: ["theme"], print: (v) => printed.push(v) });
		expect(printed[0]).toEqual({ theme: "dark" });
	});
});

describe("handler", () => {
	it("calls log.data with arguments when debug is true", () => {
		handler({ debug: true });
		expect(mockLog.data).toHaveBeenCalledWith("conf view", "arguments", expect.anything(), { debug: true });
	});

	it("calls log.error and sets exitCode on CLIError", () => {
		mockConfig.get.mockImplementation(() => {
			throw new CLIError("missing");
		});
		handler({ name: ["key"] });
		expect(mockLog.error).toHaveBeenCalledWith("conf view", "missing");
		expect(process.exitCode).toBe(1);
	});

	it("calls log.error and sets exitCode on unexpected errors", () => {
		mockConfig.get.mockImplementation(() => {
			throw new Error("unexpected");
		});
		handler({ name: ["key"] });
		expect(mockLog.error).toHaveBeenCalledWith("conf view", "Error: unexpected");
		expect(process.exitCode).toBe(1);
	});
});
