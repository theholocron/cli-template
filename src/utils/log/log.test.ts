import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockLogger } = vi.hoisted(() => ({
	mockLogger: { debug: vi.fn(), error: vi.fn(), info: vi.fn(), warn: vi.fn() },
}));

vi.mock("./logger.js", () => ({ logger: mockLogger }));

import { log } from "./log.js";

let consoleSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
	consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	vi.clearAllMocks();
});

afterEach(() => {
	consoleSpy.mockRestore();
});

describe("log.error", () => {
	it("calls logger.error and console.log", () => {
		log.error("fn", "something broke");
		expect(mockLogger.error).toHaveBeenCalledWith("[fn] something broke");
		expect(consoleSpy).toHaveBeenCalled();
	});
});

describe("log.success", () => {
	it("calls logger.info and console.log", () => {
		log.success("fn", "all good");
		expect(mockLogger.info).toHaveBeenCalledWith("[fn] all good");
		expect(consoleSpy).toHaveBeenCalled();
	});
});

describe("log.warning", () => {
	it("calls logger.warn and console.log", () => {
		log.warning("fn", "watch out");
		expect(mockLogger.warn).toHaveBeenCalledWith("[fn] watch out");
		expect(consoleSpy).toHaveBeenCalled();
	});
});

describe("log.info", () => {
	it("calls logger.info but does not print without debug", () => {
		log.info("fn", "quiet");
		expect(mockLogger.info).toHaveBeenCalledWith("[fn] quiet");
		expect(consoleSpy).not.toHaveBeenCalled();
	});

	it("calls console.log when debug is true", () => {
		log.info("fn", "verbose", { debug: true });
		expect(consoleSpy).toHaveBeenCalled();
	});
});

describe("log.process", () => {
	it("calls logger.info but does not print without debug", () => {
		log.process("fn", "working");
		expect(mockLogger.info).toHaveBeenCalledWith("[fn] working");
		expect(consoleSpy).not.toHaveBeenCalled();
	});

	it("calls console.log when debug is true", () => {
		log.process("fn", "working", { debug: true });
		expect(consoleSpy).toHaveBeenCalled();
	});
});

describe("log.data", () => {
	it("does not print without debug", () => {
		log.data("fn", "key", "value", {});
		expect(consoleSpy).not.toHaveBeenCalled();
	});

	it("calls logger.debug and console.log when debug is true", () => {
		log.data("fn", "key", "value", { debug: true });
		expect(mockLogger.debug).toHaveBeenCalledWith("[fn] key: value");
		expect(consoleSpy).toHaveBeenCalled();
	});
});
