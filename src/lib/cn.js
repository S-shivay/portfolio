/**
 * Minimal className joiner.
 *
 * Deliberately not `clsx` + `tailwind-merge`: this project has a stated
 * JavaScript budget, and every component here owns its own class list rather
 * than accepting conflicting overrides from callers, so conflict resolution
 * is not needed. Accepts strings, arrays and conditional objects.
 */
export function cn(...inputs) {
  const out = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string") {
      out.push(input);
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) out.push(key);
      }
    }
  }

  return out.join(" ");
}
