import type { KnipConfig } from "knip";

const config: KnipConfig = {
	workspaces: {
		".": {
			// src/cli.ts, commitlint.config.ts, vitest.config.ts auto-detected by Knip plugins
			entry: ["holocron.config.ts", "src/**/*.test.ts"],
			project: ["src/**/*.ts", "*.config.ts"],
			// astro.config.ts is the docs build config, not an Astro workspace — disable plugin
			astro: false,
		},
		docs: {
			// astro.config.ts lives at the repo root, not here — set entry explicitly
			entry: ["src/content.config.ts"],
		},
	},
	ignoreDependencies: [
		// commitlint "extends" uses string shorthand
		"@theholocron/commitlint-config",
		"@theholocron",
		// passed as --config arg to lint-staged binary in .husky/pre-commit
		"@theholocron/lint-staged-config",
		// loaded at runtime by the holocron plugin system — not a static import
		"@theholocron/holocron-plugin-github",
		// skills referenced as strings in holocron.config.ts
		"@theholocron/skills",
		// binary tools — invoked via CLI or hooks, not module imports
		"sort-package-json",
	],
	ignoreExportsUsedInFile: true,
};

export default config;
