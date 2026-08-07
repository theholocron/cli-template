import updateNotifier from "update-notifier";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

import { __cmddir } from "@/const";
import * as utils from "@/utils";

import pkg from "../package.json" with { type: "json" };

const { parser } = utils.env;

export interface CLIOptions {
	d?: boolean;
	debug?: boolean;
	s?: boolean;
	sound?: boolean;
	verbose?: boolean;
	// spinner: Ora;
}

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
	.usage("Usage: $0 <command> [options]")
	.commandDir(__cmddir("./commands"), {
		extensions: ["ts"],
	})
	.demandCommand()
	.env("CLI_TEMPLATE")
	.completion()
	.recommendCommands()
	.options({
		d: {
			alias: ["debug"],
			default: utils.config.get("preferences.debug") || Boolean(parser.get("debug")) || false,
			describe: "Turn on debugging mode",
			type: "boolean",
			global: true,
			hidden: true,
		},
		s: {
			alias: ["sound"],
			default: utils.config.get("preferences.sound") || Boolean(parser.get("sound")) || false,
			describe: "Turn on sound effects",
			type: "boolean",
			global: true,
			hidden: true,
		},
		verbose: {
			default: Boolean(parser.get("verbose")) || false,
			describe: "Turn on logging",
			type: "boolean",
			global: true,
		},
	})
	.alias({
		h: "help",
		v: "version",
	})
	.strict()
	.help("h")
	.version()
	.epilogue(`© 2024-${new Date().getFullYear()} The Holocron, Inc. All rights reserved.`).argv as CLIOptions;

updateNotifier({ pkg }).notify();
