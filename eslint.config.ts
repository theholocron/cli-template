import { nodeApp } from "@theholocron/eslint-config/bundles/node-app";
import type { Linter } from "eslint";

const config: Linter.Config[] = [...nodeApp(), { ignores: ["docs/**", "dist/**", "coverage/**"] }];

export default config;
