import type { HolocronConfig } from "@theholocron/cli";
import { defineConfig } from "@theholocron/cli";
import { node } from "@theholocron/holocron-config";

const { repo, workflows, providers } = node();
export default defineConfig({
	description:
		"A modern CLI template with pre-configured tools, best practices, and CI/CD setup for rapid project development.",
	homepage: "https://docs.theholocron.dev/cli-template/",
	repo: {
		name: "theholocron/cli-template",
		teams: [{ slug: "gatekeepers", permission: "maintain" }],
		topics: ["cli", "nodejs", "template", "typescript"],
		...repo,
		protection: "balanced",
		properties: {
			...repo.properties,
			runtime_environment: "node",
			open_source: true,
			uses_external_packages: false,
		},
	},
	workflows: [
		...workflows,
		"audit",
		{ name: "release", with: { "run-build": true } },
		{
			name: "deploy-docs",
			with: { name: "cli-template", "use-turbo": false },
			paths: ["docs/**"],
		},
	],
	providers: {
		...providers,
		secrets: "github",
	},
	docs: { build: "workflow", https: true },
	agent: "claude",
	skills: ["git-safety", "pr-workflow", "commit-standards", "security-review"],
} satisfies HolocronConfig);
