import type { ErrorEvent, EventHint } from "@sentry/node";
import * as Sentry from "@sentry/node";

// Set SENTRY_DSN in your environment (or .env) to enable telemetry.
// Empty string = telemetry silently disabled — safe to ship before the project exists.
function isEnabled(): boolean {
	return !process.env.NO_CLI_TEMPLATE_TELEMETRY && Boolean(process.env.SENTRY_DSN);
}

export function init(version: string): void {
	if (!isEnabled()) return;
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		release: `cli-template@${version}`,
		environment: process.env.CI ? "ci" : "local",
		tracesSampleRate: 1.0,
		beforeSend: scrubError,
	});
	Sentry.startSession();
	Sentry.setTag("os", process.platform);
	Sentry.setTag("node", process.version);
	Sentry.setTag("ci", String(Boolean(process.env.CI)));
}

export function startCommand(name: string): (ok: boolean) => void {
	if (!isEnabled()) return () => {};
	Sentry.setTag("command", name);
	const span = Sentry.startInactiveSpan({ name, op: "cli-template.command", forceTransaction: true });
	return (ok: boolean) => {
		span.setStatus({ code: ok ? 1 : 2 });
		span.end();
	};
}

export function captureException(err: unknown): void {
	if (!isEnabled()) return;
	Sentry.captureException(err);
}

export function endSession(): void {
	if (!isEnabled()) return;
	Sentry.endSession();
}

export async function flush(): Promise<void> {
	if (!isEnabled()) return;
	await Sentry.close(2_000);
}

// Scrub known token shapes from any string in the Sentry event payload.
const TOKEN_RE = /\b(ghp_|ghs_|glpat-|xoxb-|xoxp-|npm_|sk-|[A-Z][A-Z0-9_]{2,}_TOKEN[=\s])[^\s"]*/g;

function redact(raw: string): string {
	return raw.replace(TOKEN_RE, "[REDACTED]");
}

function scrubError(event: ErrorEvent, _hint: EventHint): ErrorEvent {
	return JSON.parse(redact(JSON.stringify(event))) as ErrorEvent;
}
