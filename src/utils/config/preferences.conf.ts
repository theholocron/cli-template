import * as path from "node:path";

import { HOME, OS } from "@/const";

export interface PreferencesSchema {
	debug: boolean;
	ignoredFolders: string[];
	notifications: boolean;
}

export const preferences = {
	debug: {
		type: "boolean",
		default: false,
	},
	ignoredFolders: {
		type: "array",
		items: { type: "string" },
		uniqueItems: true,
		default: [".DS_Store", "coverage", "dist", "node_modules"],
	},
	logs: {
		type: "string",
		default:
			process.env.LOG_DIR ??
			(OS === "win32"
				? path.join(process.env.LOCALAPPDATA ?? path.join(HOME, "AppData", "Local"), "CLITemplate", "logs")
				: path.join(HOME, ".cli-template", "logs")),
	},
	notifications: {
		type: "boolean",
		default: false,
	},
};
