# `@theholocron/cli-template`

<!-- holocron:description -->

A modern CLI template with pre-configured tools, best practices, and CI/CD setup for rapid project development.

<!-- /holocron:description -->

## Getting Started

Use the [Holocron CLI](https://github.com/theholocron/holocron) to scaffold a new CLI project. It clones the template, renames all placeholder references, wires up your vault provider, and runs `holocron setup` in one step:

```bash
npx @theholocron/cli new cli my-cli \
  --description "My CLI description" \
  --homepage "https://my-cli.example.com" \
  --vault doppler \
  --agent claude
```

This will:

1. Create `theholocron/my-cli` from this template on GitHub
2. Replace all `cli-template` references with `my-cli` throughout the repo
3. Run `pnpm install`
4. Run `holocron setup` to configure branch protection, labels, workflows, and repo settings


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

# Use with sound effects
cli-template log --sound
```

## Environment Variables

Copy `.env.example` to `.env` and configure as needed. The `CLI_TEMPLATE` prefix is this project's namespace — replace it with your own (e.g. `HOLOCRON`, `RANDO`) when building on this template so each CLI's env vars stay isolated.

| Variable               | Default | Description            |
| ---------------------- | ------- | ---------------------- |
| `CLI_TEMPLATE_DEBUG`   | `false` | Enable debug output    |
| `CLI_TEMPLATE_SOUND`   | `false` | Enable sound effects   |
| `CLI_TEMPLATE_VERBOSE` | `false` | Enable verbose logging |

## Development

This repo uses [pnpm workspaces](https://pnpm.io/workspaces).

```bash
pnpm dev         # run via tsx (no build needed)
pnpm build         # compile src/ → dist/
pnpm test          # run tests
pnpm test:coverage # run tests with coverage
pnpm typecheck     # type-check without emitting
pnpm lint          # run super-linter locally (requires Docker)
```

## Releases

Releases are automated via [semantic-release](https://semantic-release.gitbook.io) on push to `main`. See [CHANGELOG.md](CHANGELOG.md) for the release history.
