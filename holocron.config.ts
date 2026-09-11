import type { HolocronConfig } from "@theholocron/cli";
import { defineConfig } from "@theholocron/cli";
import { compose, node, wikiCapability as wiki } from "@theholocron/holocron-config";

const preset = compose(node(), wiki());
export default defineConfig({
	...preset,
	description:
		"A modern CLI template with pre-configured tools, best practices, and CI/CD setup for rapid project development.",
	homepage: "https://docs.theholocron.dev/cli-template/",
	repo: {
		...preset.repo,
		name: "theholocron/cli-template",
		teams: [{ slug: "gatekeepers", permission: "maintain" }],
		topics: ["cli", "nodejs", "template", "typescript"],
		protection: "strict",
		properties: {
			...preset.repo?.properties,
			runtime_environment: "node",
			open_source: true,
			uses_external_packages: false,
		},
	},
	tasks: [
		...preset.tasks,
		{ name: "audit", required: true, with: { "run-knip": true } },
		{ name: "test", with: { "run-unit": true } },
		{ name: "release", with: { "run-build": true } },
		"sync",
		{ name: "deploy", with: { docs: true } },
	],
	providers: {
		...preset.providers,
		secrets: "github",
		wiki: ["fern", { domain: "wiki.theholocron.dev", fernOrg: "holocron", icon: "fa-duotone fa-copy" }],
	},
	docs: { build: "workflow", https: true },
	agent: "claude",
	skills: ["git-safety", "pr-workflow", "commit-standards", "security-review"],
	env: {
		// Replace CLI_TEMPLATE with your project's namespace throughout.
		// HOLOCRON_* vars act as org-wide defaults; CLI_TEMPLATE_* overrides them.
		namespaces: ["HOLOCRON", "CLI_TEMPLATE"],
	},
} satisfies HolocronConfig);
