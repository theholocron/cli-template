import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { captureException, endSession, flush, init, startCommand } from "./telemetry.js";

vi.mock("@sentry/node", () => ({
	init: vi.fn(),
	setTag: vi.fn(),
	startSession: vi.fn(),
	endSession: vi.fn(),
	startInactiveSpan: vi.fn(() => ({ setStatus: vi.fn(), end: vi.fn() })),
	captureException: vi.fn(),
	close: vi.fn().mockResolvedValue(undefined),
}));

import * as Sentry from "@sentry/node";

type MockSpan = { setStatus: ReturnType<typeof vi.fn>; end: ReturnType<typeof vi.fn> };

function lastSpan(): MockSpan {
	const results = vi.mocked(Sentry.startInactiveSpan).mock.results;
	return results[results.length - 1]?.value as MockSpan;
}

const originalEnv = process.env;

beforeEach(() => {
	process.env = { ...originalEnv, NO_CLI_TEMPLATE_TELEMETRY: undefined, SENTRY_DSN: "https://test@sentry.io/1" };
	vi.clearAllMocks();
});

afterEach(() => {
	process.env = originalEnv;
});

// ── opt-out ───────────────────────────────────────────────────────────────────

describe("when NO_CLI_TEMPLATE_TELEMETRY is set", () => {
	beforeEach(() => {
		process.env["NO_CLI_TEMPLATE_TELEMETRY"] = "1";
	});

	it("init: skips Sentry.init", () => {
		init("1.0.0");
		expect(Sentry.init).not.toHaveBeenCalled();
	});

	it("startCommand: returns a no-op and skips span creation", () => {
		const finish = startCommand("log");
		expect(Sentry.startInactiveSpan).not.toHaveBeenCalled();
		expect(() => finish(true)).not.toThrow();
	});

	it("captureException: skips Sentry.captureException", () => {
		captureException(new Error("boom"));
		expect(Sentry.captureException).not.toHaveBeenCalled();
	});

	it("endSession: skips Sentry.endSession", () => {
		endSession();
		expect(Sentry.endSession).not.toHaveBeenCalled();
	});

	it("flush: skips Sentry.close", async () => {
		await flush();
		expect(Sentry.close).not.toHaveBeenCalled();
	});
});

describe("when SENTRY_DSN is not set", () => {
	beforeEach(() => {
		delete process.env["SENTRY_DSN"];
	});

	it("init: skips Sentry.init", () => {
		init("1.0.0");
		expect(Sentry.init).not.toHaveBeenCalled();
	});
});

// ── init ──────────────────────────────────────────────────────────────────────

describe("init", () => {
	it("calls Sentry.init with release and tracesSampleRate", () => {
		init("1.2.3");
		expect(Sentry.init).toHaveBeenCalledWith(
			expect.objectContaining({ release: "cli-template@1.2.3", tracesSampleRate: 1.0 })
		);
	});

	it("sets environment to 'ci' when CI=true", () => {
		process.env["CI"] = "true";
		init("1.0.0");
		expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({ environment: "ci" }));
	});

	it("sets environment to 'local' when CI is unset", () => {
		delete process.env["CI"];
		init("1.0.0");
		expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({ environment: "local" }));
	});

	it("sets os, node, and ci tags", () => {
		delete process.env["CI"];
		init("1.0.0");
		expect(Sentry.setTag).toHaveBeenCalledWith("os", process.platform);
		expect(Sentry.setTag).toHaveBeenCalledWith("node", process.version);
		expect(Sentry.setTag).toHaveBeenCalledWith("ci", "false");
	});

	it("calls Sentry.startSession after init", () => {
		init("1.0.0");
		expect(Sentry.startSession).toHaveBeenCalled();
	});
});

// ── startCommand ──────────────────────────────────────────────────────────────

describe("startCommand", () => {
	it("starts a span with command name and op", () => {
		startCommand("log");
		expect(Sentry.startInactiveSpan).toHaveBeenCalledWith(
			expect.objectContaining({ name: "log", op: "cli-template.command", forceTransaction: true })
		);
	});

	it("sets the command tag", () => {
		startCommand("conf add");
		expect(Sentry.setTag).toHaveBeenCalledWith("command", "conf add");
	});

	it("finish(true) sets ok status and ends span", () => {
		const finish = startCommand("log");
		finish(true);
		expect(lastSpan().setStatus).toHaveBeenCalledWith({ code: 1 });
		expect(lastSpan().end).toHaveBeenCalled();
	});

	it("finish(false) sets error status and ends span", () => {
		const finish = startCommand("log");
		finish(false);
		expect(lastSpan().setStatus).toHaveBeenCalledWith({ code: 2 });
		expect(lastSpan().end).toHaveBeenCalled();
	});
});

// ── captureException ──────────────────────────────────────────────────────────

describe("captureException", () => {
	it("forwards the error to Sentry", () => {
		const err = new Error("something broke");
		captureException(err);
		expect(Sentry.captureException).toHaveBeenCalledWith(err);
	});
});

// ── endSession ────────────────────────────────────────────────────────────────

describe("endSession", () => {
	it("calls Sentry.endSession", () => {
		endSession();
		expect(Sentry.endSession).toHaveBeenCalled();
	});
});

// ── flush ─────────────────────────────────────────────────────────────────────

describe("flush", () => {
	it("calls Sentry.close with a 2000ms timeout", async () => {
		await flush();
		expect(Sentry.close).toHaveBeenCalledWith(2_000);
	});
});

// ── scrubError (via beforeSend) ───────────────────────────────────────────────

describe("scrubError", () => {
	function getBeforeSend() {
		init("1.0.0");
		const options = vi.mocked(Sentry.init).mock.calls[0]?.[0] as {
			beforeSend: (event: object, hint: object) => object;
		};
		return options.beforeSend;
	}

	it("redacts ghp_ tokens", () => {
		const scrub = getBeforeSend();
		const result = scrub({ message: "auth failed with ghp_abc123XYZ" }, {});
		expect(JSON.stringify(result)).not.toContain("ghp_abc123");
		expect(JSON.stringify(result)).toContain("[REDACTED]");
	});

	it("redacts SCREAMING_SNAKE_TOKEN= patterns", () => {
		const scrub = getBeforeSend();
		const result = scrub({ message: "GITHUB_TOKEN=ghs_secret456" }, {});
		expect(JSON.stringify(result)).not.toContain("ghs_secret456");
		expect(JSON.stringify(result)).toContain("[REDACTED]");
	});

	it("leaves non-token content intact", () => {
		const scrub = getBeforeSend();
		const result = scrub({ message: "config not found at ./holocron.config.ts" }, {});
		expect(JSON.stringify(result)).toContain("config not found");
	});
});
