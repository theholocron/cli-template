import * as fs from "node:fs";
import * as path from "node:path";

import winston from "winston";

import { config } from "@/utils/config";

const LOGS = config.get("preferences.logs") as string;

if (!fs.existsSync(LOGS)) {
	fs.mkdirSync(LOGS, { recursive: true });
}

export type LogLevel = "error" | "warn" | "info" | "verbose" | "debug";

export const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
	),
	transports: [
		new winston.transports.File({ filename: path.join(LOGS, "cli-template.log") }),
		new winston.transports.File({ filename: path.join(LOGS, "error.log"), level: "error" }),
	],
});
