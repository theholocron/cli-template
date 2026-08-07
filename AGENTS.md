# theholocron/cli-template — agent operating contract

`CLAUDE.md` is a symlink to this file, so Claude, Codex, and every other agent
read the same rules. Put durable, repo-wide agent guidance here.

@../github-private/AGENTS.md

## What this repo is

<description>

## Architecture

- Single published npm package (`@theholocron/cli-template`) with a CLI binary.
- TypeScript source in `src/`, compiled to `dist/` via `tsdown`.
- Entry point: `src/cli.ts`.
- Tested with vitest.

## Quality

- `pnpm build` — tsdown
- `pnpm test` — vitest
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — ESLint
