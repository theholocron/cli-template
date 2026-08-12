---
title: Telemetry
description: How to enable Sentry error tracking and command-level tracing in your CLI.
---

Error telemetry is powered by [Sentry](https://sentry.io) and is **disabled by default**. Nothing is sent until you set a DSN.

## What is collected

When enabled, each CLI invocation reports:

- Unhandled rejections and caught exceptions
- A span per command (name, success/failure status)
- Runtime tags: OS platform, Node.js version, whether running in CI

Tokens and secrets are scrubbed from all payloads before transmission — any value matching common token shapes (`ghp_`, `ghs_`, `SCREAMING_SNAKE_TOKEN=`, etc.) is replaced with `[REDACTED]`.

## Enabling telemetry

1. Create a [Sentry project](https://sentry.io/getting-started/) and select **Node.js** as the platform.
2. Copy the DSN from **Settings → Client Keys (DSN)**.
3. Set it in your environment or `.env` file:

```bash
# .env
CLI_TEMPLATE_SENTRY_DSN=https://<key>@<org>.ingest.sentry.io/<project>
```

The `HOLOCRON_SENTRY_DSN` var works as an org-wide default if you run multiple CLIs built on this template — the per-tool `CLI_TEMPLATE_SENTRY_DSN` takes precedence when both are set.

## Opting out

Set `CLI_TEMPLATE_NO_TELEMETRY` to any value to disable telemetry at runtime, regardless of whether a DSN is configured:

```bash
CLI_TEMPLATE_NO_TELEMETRY=1 cli-template log
```

Or add it to `.env` to opt out persistently.
