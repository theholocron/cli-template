import starlight from "@astrojs/starlight";
import { docsTheme } from "@theholocron/docs-theme";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://theholocron.github.io",
	base: "/cli-template",
	integrations: [
		starlight({
			title: "CLI Template",
			plugins: [docsTheme()],
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/theholocron/cli-template",
				},
			],
			sidebar: [{ label: "Overview", slug: "" }],
		}),
	],
});
