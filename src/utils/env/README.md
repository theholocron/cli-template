# Environment Variables

A wrapper around [`@theholocron/env-utils`](https://github.com/theholocron/utils) that provides namespace-scoped environment variable parsing with cascade priority.

The parser reads from `process.env` (populated by the shell or a `.env` file loaded upstream) and resolves values under the `CLI_TEMPLATE_*` namespace.

## Usage

```javascript
import { env } from "@/utils";

// read a value (falls back through namespace cascade)
const debug = env.parser.get("debug");

// write vars back to the .env file
const [err, ok] = env.write({ CLI_TEMPLATE_DEBUG: "true" });
```

### When to use `env.parser` or `process.env`

#### Use `process.env` for direct access

When you need a raw env var and have no namespace or cascade requirements, `process.env.SOME_VAR` is fine.

#### Use `env.parser.get()` for namespaced access

`env.parser` resolves values through the `CLI_TEMPLATE_*` namespace cascade, so it handles prefix stripping, type coercion, and default values automatically.

#### Use `env.write()` for persisting to `.env`

Reads the current `.env` file, merges the new values, and writes it back. Existing vars not in the update are preserved.

## API

### `env.parser`

An `EnvParser` instance from `@theholocron/env-utils` scoped to the `CLI_TEMPLATE` namespace.

### `env.write(obj)`

Merges `obj` into the `.env` file at `process.cwd()/.env` and writes it back.

#### obj

Type: `Record<string, string>`

Returns: `[Error | null, boolean]`
