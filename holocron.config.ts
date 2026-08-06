import type { HolocronConfig } from "@theholocron/cli";
import { defineConfig } from "@theholocron/cli";
import { node } from "@theholocron/holocron-config";

const { repo, workflows, providers } = node();
export default defineConfig({
	description: "Node.js CLI starter template for @theholocron repos.",
	homepage: "https://docs.theholocron.dev/cli-template/",
	repo: {
		name: "theholocron/cli-template",
		teams: [{ slug: "gatekeepers", permission: "maintain" }],
		topics: ["cli", "nodejs", "template", "typescript"],
		...repo,
		protection: "balanced",
		properties: {
			...repo.properties,
			open_source: true,
			uses_external_packages: false,
		},
	},
	workflows: [
		...workflows,
		{ name: "release", with: { "run-build": true } },
		{
			name: "deploy-docs",
			with: { name: "cli-template" },
			paths: ["docs/**"],
		},
	],
	providers: {
		...providers,
		secrets: "github",
	},
	agent: "claude",
	skills: ["git-safety", "pr-workflow", "commit-standards", "security-review"],
} satisfies HolocronConfig);
