import type { CommandBuilder } from "yargs";

import { CLIOptions } from "@/cli";
import { config, log } from "@/utils";

interface AddConfOpts extends CLIOptions {
	name: string;
	value: string;
}

export const builder: CommandBuilder<AddConfOpts, AddConfOpts> = (yargs) =>
	yargs
		.positional("name", {
			demandOption: true,
			describe: "A key to store as within the configuration file",
			type: "string",
		})
		.positional("value", {
			demandOption: true,
			describe: "The value to store within the configuration file",
			type: "string",
		});
export const command: string = "add <name> <value>";
export const desc: string = "Add to the configuration";
export function handler(options: AddConfOpts): void {
	const FN = "conf add";
	log.data(FN, "arguments", options, options);

	const { name, value } = options;
	const existing = config.get(name) as unknown;

	if (Array.isArray(existing)) {
		config.set(name, Array.from(new Set([...existing, value])));
	} else if (existing !== null && typeof existing === "object") {
		config.set(name, { ...(existing as Record<string, unknown>), [name]: value });
	} else {
		config.set(name, value);
	}

	log.success(FN, String(config.get(name)));
}
