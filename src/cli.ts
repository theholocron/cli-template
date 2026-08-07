import updateNotifier from "update-notifier";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { __cmddir } from "@/const";
import * as utils from "@/utils";

import pkg from "../package.json" with { type: "json" };

const { parser } = utils.env;

// The yargs .env() prefix must match the last (most-specific) namespace.
// Update this if NAMESPACES in src/utils/env/env.ts changes.
const ENV_PREFIX = "CLI_TEMPLATE";

export interface CLIOptions {
	d?: boolean;
	debug?: boolean;
	s?: boolean;
	sound?: boolean;
	verbose?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
	.scriptName("cli-template")
	.usage("Usage: $0 <command> [options]")
	.commandDir(__cmddir("./commands"), { extensions: ["js", "ts"] })
	.demandCommand()
	.env(ENV_PREFIX)
	.completion()
	.recommendCommands()
	.options({
		d: {
			alias: ["debug"],
			default: Boolean(utils.config.get("preferences.debug")) || Boolean(parser.get("debug")) || false,
			describe: "Turn on debugging mode",
			type: "boolean",
			global: true,
			hidden: true,
		},
		s: {
			alias: ["sound"],
			default: Boolean(utils.config.get("preferences.sound")) || Boolean(parser.get("sound")) || false,
			describe: "Turn on sound effects",
			type: "boolean",
			global: true,
			hidden: true,
		},
		verbose: {
			default: Boolean(parser.get("verbose")) || false,
			describe: "Turn on verbose logging",
			type: "boolean",
			global: true,
		},
	})
	.alias({ h: "help", v: "version" })
	.strict()
	.help("h")
	.version()
	.epilogue(`© 2024-${new Date().getFullYear()} The Holocron, Inc. All rights reserved.`).argv as CLIOptions;

updateNotifier({ pkg }).notify();
