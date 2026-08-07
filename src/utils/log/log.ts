import { type CLIOptions } from "@/cli";
import { style } from "@/utils/style";

import { logger } from "./logger";
import { sound } from "./sound";

const data = (prefix: string, key: string, message: unknown, options: CLIOptions) => {
	if (options?.debug) {
		logger.debug(`[${prefix}] ${key}: ${String(message)}`);
		console.log(style.hint(`[${prefix}] ${key}:`), message);
	}
};

const error = (prefix: string, message: string, options?: CLIOptions) => {
	logger.error(`[${prefix}] ${message}`);
	console.log(style.fail(message));
	if (options?.sound) sound.error();
};

const info = (prefix: string, message: string, options?: CLIOptions) => {
	logger.info(`[${prefix}] ${message}`);
	if (options?.debug) console.log(style.step(`[${prefix}] ${message}`));
};

const processing = (prefix: string, message: string, options?: CLIOptions) => {
	logger.info(`[${prefix}] ${message}`);
	if (options?.debug) console.log(style.hint(`[${prefix}] ${message}`));
};

const success = (prefix: string, message: string, options?: CLIOptions) => {
	logger.info(`[${prefix}] ${message}`);
	console.log(style.success(message));
	if (options?.sound) sound.success();
};

const warning = (prefix: string, message: string, options?: CLIOptions) => {
	logger.warn(`[${prefix}] ${message}`);
	console.log(style.warn(message));
	if (options?.sound) sound.warning();
};

export const log = {
	data,
	error,
	info,
	process: processing,
	success,
	warning,
};
