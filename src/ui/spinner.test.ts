import { describe, expect, it, vi } from "vitest";

import { withSpinner } from "./spinner.js";

vi.mock("ora", () => ({
	default: () => ({
		start: vi.fn().mockReturnThis(),
		succeed: vi.fn(),
		fail: vi.fn(),
	}),
}));

describe("withSpinner", () => {
	it("skips the spinner in non-TTY environments and returns the fn result", async () => {
		Object.defineProperty(process.stdout, "isTTY", { value: false, configurable: true });
		const result = await withSpinner("loading", async () => "done");
		expect(result).toBe("done");
	});

	it("shows a spinner in TTY environments and returns the fn result", async () => {
		Object.defineProperty(process.stdout, "isTTY", { value: true, configurable: true });
		const result = await withSpinner("loading", async () => 42);
		expect(result).toBe(42);
	});

	it("calls spinner.fail and rethrows when fn throws in TTY", async () => {
		Object.defineProperty(process.stdout, "isTTY", { value: true, configurable: true });
		await expect(
			withSpinner("loading", async () => {
				throw new Error("boom");
			})
		).rejects.toThrow("boom");
	});
});
