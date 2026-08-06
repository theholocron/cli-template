import fs from "node:fs";

import { createEnvParser, type EnvParser } from "@theholocron/env-utils";

// The namespace(s) this CLI uses for its env vars.
// Must match the `env.namespaces` array in holocron.config.ts so that
// tooling and runtime stay in sync.
// Add org-wide prefixes before the project-specific one:
//   ["HOLOCRON", "CLI_TEMPLATE"]  →  HOLOCRON_* as defaults, CLI_TEMPLATE_* overrides
const NAMESPACES = ["CLI_TEMPLATE"] as const;

export const parser: EnvParser = createEnvParser({
	appName: "cli-template",
	namespaces: [...NAMESPACES],
});

const ENV_CONF = `${process.cwd()}/.env`;

/**
 * Writes env vars back to the .env file (used by `conf` commands).
 * Reads the current file first and merges so existing vars are preserved.
 */
export const writeEnv = (obj: Record<string, string>): [Error | null, boolean] => {
	try {
		const existing: Record<string, string> = {};
		if (fs.existsSync(ENV_CONF)) {
			const lines = fs.readFileSync(ENV_CONF, "utf8").split("\n");
			for (const line of lines) {
				const eq = line.indexOf("=");
				if (eq > 0) existing[line.slice(0, eq)] = line.slice(eq + 1);
			}
		}

		const merged = { ...existing, ...obj };
		const content = Object.entries(merged)
			.map(([k, v]) => `${k}=${v}`)
			.join("\n");

		fs.writeFileSync(ENV_CONF, content, { flag: "w+" });
		return [null, true];
	} catch (err) {
		return [err as Error, false];
	}
};

export const env = {
	parser,
	write: writeEnv,
};
