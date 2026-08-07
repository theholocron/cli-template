import { search } from "@inquirer/prompts";

import { type Choice } from "./types";

export async function searchPrompt(source: Choice<string>[], message?: string): Promise<string> {
	return await search({
		message: message ?? "Search a term",
		source: async (input) =>
			source.filter(({ name }) => {
				const proj = name?.toLowerCase() ?? "";
				return proj.length > 0 && proj.includes((input ?? "").toLowerCase());
			}),
	});
}
