import autocomplete from "inquirer-autocomplete-standalone";

import { type Choice } from "./types";

export async function searchPrompt(source: Choice<string>[], message?: string): Promise<string> {
	return await autocomplete({
		emptyText: "No results found. Please enter a term",
		message: message ?? "Search a term",
		source: async (input?: string) =>
			source.filter(({ name }) => {
				const proj = name?.toLowerCase() ?? "";
				return proj.length > 0 && proj.includes(input?.toLowerCase() ?? "");
			}),
	});
}
