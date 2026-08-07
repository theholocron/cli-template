import type { KnipConfig } from "knip";

const config: KnipConfig = {
	entry: ["src/cli.ts", "commitlint.config.ts", "holocron.config.ts"],
	project: ["src/**/*.ts", "*.config.ts"],
	ignoreDependencies: [
		"@theholocron/tsconfig",
		"@theholocron/commitlint-config",
		"@theholocron/lint-staged-config",
		"husky",
	],
	ignoreExportsUsedInFile: true,
};

export default config;
