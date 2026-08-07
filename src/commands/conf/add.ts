import type { CommandBuilder } from "yargs";

import { type CLIOptions } from "@/cli";
import { CLIError } from "@/errors";
import { config, log } from "@/utils";

// ── Input / Report ──────────────────────────────────────────────────────

export interface RunConfAddInput {
	name: string;
	value: string;
	print?: (msg: string) => void;
}

export interface ConfAddReport {
	status: "ok" | "fail";
	key: string;
	value: unknown;
	message?: string;
}

// ── Business logic (injectable, testable) ───────────────────────────────

export function runConfAdd(input: RunConfAddInput): ConfAddReport {
	const { name, value, print = console.log } = input;
	const existing = config.get(name) as unknown;

	if (Array.isArray(existing)) {
		config.set(name, Array.from(new Set([...existing, value])));
	} else if (existing !== null && typeof existing === "object") {
		config.set(name, { ...(existing as Record<string, unknown>), [name]: value });
	} else {
		config.set(name, value);
	}

	const updated = config.get(name);
	print(`Set ${name} = ${String(updated)}`);
	return { status: "ok", key: name, value: updated };
}

// ── Yargs wiring ────────────────────────────────────────────────────────

interface AddConfOpts extends CLIOptions {
	name: string;
	value: string;
}

export const builder: CommandBuilder<AddConfOpts, AddConfOpts> = (yargs) =>
	yargs
		.positional("name", {
			demandOption: true,
			describe: "A key to store within the configuration file",
			type: "string",
		})
		.positional("value", {
			demandOption: true,
			describe: "The value to store",
			type: "string",
		});
export const command: string = "add <name> <value>";
export const desc: string = "Add to the configuration";

export function handler(options: AddConfOpts): void {
	const FN = "conf add";
	log.data(FN, "arguments", options, options);
	try {
		const report = runConfAdd({ name: options.name, value: options.value, print: (msg) => log.success(FN, msg) });
		if (report.status === "fail") process.exitCode = 1;
	} catch (err) {
		log.error(FN, err instanceof CLIError ? err.message : String(err));
		process.exitCode = 1;
	}
}
