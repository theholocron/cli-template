import { env } from "@/utils";

const { parser } = env;

// Read all env vars under the configured namespace(s)
const debug = parser.get("debug");
console.log("debug:", debug);

// Read a specific key
const verbose = parser.get("verbose");
console.log("verbose:", verbose);

// Map to a typed config shape
const config = parser.map((get: (key: string) => unknown) => ({
	debug: Boolean(get("debug")),
	verbose: Boolean(get("verbose")),
}));
console.log("config:", config);
