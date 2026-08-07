import defaultBrowser from "default-browser";
import open, { apps } from "open";

/**
 * Opens a URL in the user's browser, preferring Chrome/Firefox/Edge.
 * Falls back to Chrome if the default browser isn't one of those three.
 */
export async function openBrowser(url: string): Promise<void> {
	if (!url) {
		throw new Error("No URL was provided!");
	}

	let browser = apps.browser;
	const { name } = await defaultBrowser();
	const supported = ["chrome", "firefox", "edge"];
	if (!supported.includes(name.toLowerCase())) {
		browser = apps.chrome;
	}

	await open(url, {
		app: { name: browser },
	});
}
