import { nodeApp } from "@theholocron/eslint-config/bundles/node-app";
import type { Linter } from "eslint";

const config: Linter.Config[] = [
	...nodeApp(),
	{
		rules: {
			// sort-package-json (lint-staged) owns field ordering and uses a different
			// canonical order than this rule — keeping both causes an unresolvable
			// conflict. Remove once @theholocron/eslint-config disables this globally.
			"package-json/sort-properties": "off",
		},
	},
	{ ignores: ["docs/**", "dist/**", "coverage/**"] },
];

export default config;
