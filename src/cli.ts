import updateNotifier from "update-notifier";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { __cmddir } from "@/const";
import { CLIError } from "@/errors";
import { captureException, endSession, flush, init, startCommand } from "@/telemetry";
import * as utils from "@/utils";

import pkg from "../package.json" with { type: "json" };

const { parser } = utils.env;

// The yargs .env() prefix must match the last (most-specific) namespace.
// Update this if NAMESPACES in src/utils/env/env.ts changes.
const ENV_PREFIX = "CLI_TEMPLATE";

export interface CLIOptions {
	d?: boolean;
	debug?: boolean;
	verbose?: boolean;
}

process.on("unhandledRejection", (err) => {
	captureException(err);
	utils.log.error("cli", err instanceof CLIError ? err.message : String(err));
	process.exitCode = 1;
});

init(pkg.version);
let finishCommand: (ok: boolean) => void = () => {};

try {
	(await yargs(hideBin(process.argv))
		.middleware((argv) => {
			const name = (argv._ as string[]).slice(0, 2).join(" ") || "unknown";
			finishCommand = startCommand(name);
		})
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
		.epilogue(`© 2024-${new Date().getFullYear()} The Holocron, Inc. All rights reserved.`).argv) as CLIOptions;
} catch (err) {
	captureException(err);
	process.exitCode = 1;
} finally {
	finishCommand(!process.exitCode);
	endSession();
	await flush();
}

updateNotifier({ pkg }).notify();
