# CLI Template

<!-- holocron:description -->

A modern CLI template with pre-configured tools, best practices, and CI/CD setup for rapid project development.

<!-- /holocron:description -->

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

```bash
pnpm install       # install deps
pnpm build         # compile src/ → dist/
pnpm start         # run via tsx (no build needed)
pnpm test          # run tests
pnpm typecheck     # type-check without emitting
pnpm lint          # run super-linter locally (requires Docker)
```

## Releases

Releases are automated via [semantic-release](https://semantic-release.gitbook.io) on push to `main`. See [CHANGELOG.md](CHANGELOG.md) for the release history.

## Documentation

Check out [The Holocron Archive](https://docs.theholocron.dev/cli-template/) for more information.
