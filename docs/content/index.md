---
title: Overview
description: A modern CLI template with pre-configured tools, best practices, and CI/CD setup for rapid project development.
---

A modern CLI template with pre-configured tools, best practices, and CI/CD setup for rapid project development.

## Features

- **[Yargs](https://yargs.js.org/)** — command routing, option parsing, auto-completion, and env-var binding
- **[Inquirer](https://github.com/SBoudrias/Inquirer.js)** — interactive prompts (select, confirm, autocomplete, search)
- **[Conf](https://github.com/sindresorhus/conf)** — persistent user preferences with JSON-schema validation
- **[Winston](https://github.com/winstonjs/winston)** — structured file logging (error, warn, info, verbose, debug)
- **[Chalk](https://github.com/chalk/chalk)** — terminal colour output
- **[Ora](https://github.com/sindresorhus/ora)** — spinner for long-running tasks
- **[dotenv](https://github.com/motdotla/dotenv)** — `.env` file support with a configurable namespace prefix
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

Copy `.env.example` to `.env`. The `CLI_TEMPLATE` prefix is the project namespace — replace it consistently when building on this template.

| Variable               | Default | Description            |
| ---------------------- | ------- | ---------------------- |
| `CLI_TEMPLATE_DEBUG`   | `false` | Enable debug output    |
| `CLI_TEMPLATE_SOUND`   | `false` | Enable sound effects   |
| `CLI_TEMPLATE_VERBOSE` | `false` | Enable verbose logging |

## Project Structure

```
src/
├── cli.ts          # yargs entry point and global options
├── const.ts        # shared path/OS constants
├── commands/       # one file per sub-command
│   ├── conf.ts     # persistent config management
│   └── log.ts      # example logging command
├── ui/
│   ├── prompts/    # select, confirm, autocomplete, search
│   └── open/       # open URLs or files in the default app
└── utils/
    ├── config/     # conf wrapper and preferences schema
    ├── env/        # dotenv reader/writer
    ├── log/        # winston logger + chalk helpers
    └── string.ts   # string utilities
```
