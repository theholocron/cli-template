import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { coverage, node } from "@theholocron/vitest-config";
import { defineConfig } from "vitest/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	...node({
		coverage: {
			...coverage,
			include: ["src/**/*.ts"],
			exclude: [
				...coverage.exclude,
				// CLI entry — yargs wiring, not unit-testable
				"src/cli.ts",
				// Example files — illustrative, not logic
				"src/**/*.example.ts",
				// Yargs command grouping — no logic
				"src/commands/conf.ts",
				// Reads filesystem / readline — integration-level
				"src/commands/log.ts",
				// Schema/config objects — no logic to test
				"src/utils/config/preferences.conf.ts",
				// Interactive prompts — require TTY input
				"src/ui/prompts/confirm.prompt.ts",
				"src/ui/prompts/search.prompt.ts",
				"src/ui/prompts/select.prompt.ts",
				// Conf instantiation — writes to disk
				"src/utils/config/config.ts",
				// Winston logger — I/O side effects
				"src/utils/log/logger.ts",
			],
		},
	}),
});
