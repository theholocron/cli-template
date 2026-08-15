# Spinner

An `ora` spinner wrapper for long-running async tasks.

In non-TTY environments (CI, pipes, tests) the spinner is skipped entirely and `fn` runs directly, so callers need no special handling.

## Usage

```javascript
import { withSpinner } from "@/ui";

const result = await withSpinner("Fetching data…", async () => {
  return await fetchSomething();
});
```

The spinner shows the label while `fn` runs, calls `spinner.succeed()` on resolve, and `spinner.fail()` on rejection before re-throwing.

## API

### `withSpinner(label, fn)`

#### label

The text shown next to the spinner.

Type: `string`

#### fn

An async function to run while the spinner is active.

Type: `() => Promise<T>`

Returns: `Promise<T>`
