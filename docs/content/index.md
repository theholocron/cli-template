---
title: Overview
description: A modern CLI template with pre-configured tools, best practices, and CI/CD setup for rapid project development.
---

A modern CLI template with pre-configured tools, best practices, and CI/CD setup for rapid project development.

## Features

- **[Yargs](https://yargs.js.org/)** — command routing, option parsing, auto-completion, and env-var binding
- **[Inquirer](https://github.com/SBoudrias/Inquirer.js)** — interactive prompts (select, confirm, search)
- **[Conf](https://github.com/sindresorhus/conf)** — persistent user preferences with JSON-schema validation
- **[Winston](https://github.com/winstonjs/winston)** — structured file logging (error, warn, info, verbose, debug)
- **[Chalk](https://github.com/chalk/chalk)** — terminal colour output
- **[Ora](https://github.com/sindresorhus/ora)** — spinner for long-running tasks
- **[@theholocron/env-utils](https://github.com/theholocron/utils)** — namespace-scoped env var parsing with `HOLOCRON_*` → `CLI_TEMPLATE_*` cascade
- **[Sentry](https://sentry.io)** — error tracking and command-level tracing; opt-in via `CLI_TEMPLATE_SENTRY_DSN`
- **[update-notifier](https://github.com/yeoman/update-notifier)** — nudges users to upgrade when a new version is published

## Installation

```bash
npm install --global @theholocron/cli-template
```

## Usage

```bash
cli-template --help

# Run a built-in command
cli-template log

# Enable debug output for a single run
cli-template log --debug

# Or set it persistently via env
CLI_TEMPLATE_DEBUG=true cli-template log
```

## Environment Variables

Copy `.env.example` to `.env`. Variables follow a two-level namespace cascade: `HOLOCRON_*` sets org-wide defaults, `CLI_TEMPLATE_*` overrides them per-tool. Replace both prefixes consistently when building on this template.

| Variable                    | Default | Description                                                                  |
| --------------------------- | ------- | ---------------------------------------------------------------------------- |
| `CLI_TEMPLATE_DEBUG`        | `false` | Enable debug output                                                          |
| `CLI_TEMPLATE_VERBOSE`      | `false` | Enable verbose logging                                                       |
| `CLI_TEMPLATE_SENTRY_DSN`   | —       | Sentry DSN — enables error telemetry when set (see [Telemetry](./telemetry)) |
| `CLI_TEMPLATE_NO_TELEMETRY` | —       | Set to any value to opt out of error telemetry                               |

## Project Structure

```
src/
├── cli.ts          # yargs entry point and global options
├── const.ts        # shared path/OS constants
├── errors.ts       # CLIError base class
├── telemetry.ts    # Sentry init, command spans, and token scrubbing
├── commands/       # one file per sub-command
│   ├── conf.ts     # persistent config management
│   └── log.ts      # example logging command
├── ui/
│   └── prompts/    # select, confirm, search
└── utils/
    ├── config/     # conf wrapper and preferences schema
    ├── env/        # env-utils parser and .env writer
    ├── log/        # winston logger + chalk helpers
    └── string.ts   # string utilities
```
