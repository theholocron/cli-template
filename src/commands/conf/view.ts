import type { CommandBuilder } from "yargs";

import { type CLIOptions } from "@/cli";
import { CLIError } from "@/errors";
import { config, str, style } from "@/utils";

// ── Input / Report ──────────────────────────────────────────────────────

export interface RunConfViewInput {
	name?: string[];
	print?: (value: unknown) => void;
}

export interface ConfViewReport {
	status: "ok" | "fail";
	value: Record<string, unknown> | Record<string, unknown>[];
}

// ── Business logic (injectable, testable) ───────────────────────────────

export function runConfView(input: RunConfViewInput): ConfViewReport {
	const { name, print = console.log } = input;

	if (name && name.length > 0) {
		const items = name.reduce(
			(acc, key) => {
				acc[key] = config.get(key) as unknown;
				return acc;
			},
			{} as Record<string, unknown>
		);
		print(items);
		return { status: "ok", value: items };
	}

	const all = config.store as unknown as Record<string, unknown>;
	print(all);
	return { status: "ok", value: all };
}

// ── Yargs wiring ────────────────────────────────────────────────────────

interface ViewConfOpts extends CLIOptions {
	name?: string[];
}

export const builder: CommandBuilder<ViewConfOpts, ViewConfOpts> = (yargs) =>
	yargs.positional("name", {
		coerce: str.toArray,
		describe: "Any key within the configuration file",
		type: "string",
	});
export const command: string = "view [name..]";
export const desc: string = "View the configuration";

export function handler(options: ViewConfOpts): void {
	try {
		const report = runConfView({ name: options.name });
		if (report.status === "fail") process.exitCode = 1;
	} catch (err) {
		console.error(err instanceof CLIError ? style.fail(err.message) : err);
		process.exitCode = 1;
	}
}
