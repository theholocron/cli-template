import ora from "ora";

/**
 * Runs `fn` with an ora spinner for its duration.
 * In non-TTY environments (CI, pipes, tests) the spinner is skipped.
 */
export async function withSpinner<T>(label: string, fn: () => Promise<T>): Promise<T> {
	if (!process.stdout.isTTY) {
		return fn();
	}
	const spinner = ora(label).start();
	try {
		const result = await fn();
		spinner.succeed();
		return result;
	} catch (err) {
		spinner.fail();
		throw err;
	}
}
