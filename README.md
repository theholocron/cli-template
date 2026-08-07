# `@theholocron/cli-template`

<!-- holocron:description -->

A modern CLI template with pre-configured tools, best practices, and CI/CD setup for rapid project development.

<!-- /holocron:description -->

<!-- holocron:template-only -->

## Getting Started

Use the [Holocron CLI](https://github.com/theholocron/holocron) to scaffold a new CLI project from this template. It clones the repo, renames all placeholder references, and runs `holocron setup` in one step:

```bash
npx @theholocron/cli new cli my-cli \
  --description "My CLI description" \
  --homepage "https://my-cli.example.com"
```

This will:

1. Create `theholocron/my-cli` on GitHub from this template
2. Replace all `CLI_TEMPLATE` and `cli-template` references with your CLI name
3. Run `pnpm install`
4. Run `holocron setup` to configure branch protection, labels, workflows, and repo settings

<!-- /holocron:template-only -->

<!-- holocron:installation -->

## Installation

```bash
npm install --global @theholocron/cli-template
```

## Usage

```bash
cli-template --help

# Run a command
cli-template log

# Use with debug output
cli-template log --debug

# Use with verbose output
cli-template log --verbose
```

<!-- /holocron:installation -->

## Environment Variables

Copy `.env.example` to `.env` and configure as needed. The `CLI_TEMPLATE` prefix is this project's namespace — replace it with your own (e.g. `HOLOCRON`, `RANDO`) when building on this template so each CLI's env vars stay isolated.

| Variable               | Default | Description            |
| ---------------------- | ------- | ---------------------- |
| `CLI_TEMPLATE_DEBUG`   | `false` | Enable debug output    |
| `CLI_TEMPLATE_VERBOSE` | `false` | Enable verbose logging |

## Development

```bash
pnpm build         # compile src/ → dist/
pnpm dev         # run via tsx (no build needed)
pnpm test          # run tests
pnpm test:coverage # run tests with coverage
pnpm typecheck     # type-check without emitting
pnpm lint          # run super-linter locally (requires Docker)
```

## What's Included

| Category          | Tool                                                                                 | Purpose                                                           |
| ----------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **CLI framework** | [Yargs](https://yargs.js.org/)                                                       | Command routing, option parsing, env-var binding, auto-completion |
| **Prompts**       | [Inquirer](https://github.com/SBoudrias/Inquirer.js)                                 | Interactive select, confirm, and search prompts                   |
| **Config**        | [Conf](https://github.com/sindresorhus/conf)                                         | Persistent user preferences with JSON-schema validation           |
| **Logging**       | [Winston](https://github.com/winstonjs/winston)                                      | Structured file logging; terminal output via style utilities      |
| **Terminal UI**   | [Chalk](https://github.com/chalk/chalk) + [Ora](https://github.com/sindresorhus/ora) | Colour output and spinners for long-running tasks                 |
| **Environment**   | [@theholocron/env-utils](https://github.com/theholocron/utils)                       | Namespace-scoped env var parsing with cascade priority            |
| **Updates**       | [update-notifier](https://github.com/yeoman/update-notifier)                         | Prompts users to upgrade when a new version is published          |
| **Build**         | [tsdown](https://tsdown.dev/)                                                        | Compiles `src/cli.ts` → `dist/cli.mjs` with a Node.js shebang     |
| **CI/CD**         | GitHub Actions + semantic-release                                                    | Automated lint, test, typecheck, and publish on push to `main`    |

## Releases

Releases are automated via [semantic-release](https://semantic-release.gitbook.io) on push to `main`. See [CHANGELOG.md](CHANGELOG.md) for the release history.
