import * as fs from "node:fs";
import * as readline from "node:readline";

import chalk from "chalk";
import type { CommandBuilder } from "yargs";

import { type CLIOptions } from "@/cli";
import { config, type LogLevel } from "@/utils";

export interface LogOpts extends CLIOptions {
	level?: LogLevel;
	maxLines?: number;
}

const levelFiles: Record<LogLevel, string> = {
	error: "error.log",
	warn: "cli-template.log",
	info: "cli-template.log",
	verbose: "cli-template.log",
	debug: "cli-template.log",
};

const levelStyles: Record<LogLevel, (s: string) => string> = {
	error: chalk.bold.red,
	warn: chalk.bold.yellow,
	info: chalk.bold.cyan,
	verbose: chalk.bold.blue,
	debug: chalk.bold.gray,
};

export const builder: CommandBuilder<LogOpts, LogOpts> = (yargs) =>
	yargs.options({
		l: {
			alias: ["level", "log-level"],
			choices: ["error", "warn", "info", "verbose", "debug"] as LogLevel[],
			default: "info" as LogLevel,
			demandOption: true,
			describe: "The log level to show",
		},
		o: {
			alias: ["output", "max-lines"],
			default: 20,
			describe: "Maximum number of lines to show, from the end of the file",
			type: "number",
		},
	});
export const command: string = "log";
export const desc: string = "Print out the logs";

export async function handler(options: LogOpts): Promise<void> {
	const { level = "info", maxLines } = options;
	const logsDir = config.get("preferences.logs") as string;
	const logFilePath = `${logsDir}/${levelFiles[level]}`;

	const fileStream = fs.createReadStream(logFilePath);
	const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

	const lines: { number: number; content: string }[] = [];
	let lineNumber = 0;

	rl.on("line", (line: string) => {
		lineNumber++;
		lines.push({ number: lineNumber, content: line });
		if (maxLines !== undefined && lines.length > maxLines) {
			lines.shift();
		}
	});

	await new Promise<void>((resolve) => rl.on("close", resolve));

	const bracketStyle = chalk.magenta;

	for (const { number, content } of lines) {
		const match = content.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (\w+): (.+)/);
		if (match) {
			const [, timestamp, lvl, rawMessage] = match;
			const colorLevel = levelStyles[lvl as LogLevel] ?? chalk.white;
			const message = rawMessage.replace(/\[([^\]]+)\]/g, (_, p1: string) => bracketStyle(`[${p1}]`));
			console.log(
				`${chalk.gray(number)}: ${chalk.yellow(`[${timestamp}]`)} ${colorLevel(lvl)}: ${chalk.white(message)}`
			);
		} else {
			const formatted = content.replace(/\[([^\]]+)\]/g, (_, p1: string) => bracketStyle(`[${p1}]`));
			console.log(`${chalk.gray(number)}: ${formatted}`);
		}
	}
}
