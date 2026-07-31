// Small pure string helpers. Zero dependencies by design — `node --test` is
// built in, so an agent can run the suite with no network and no install step.

/** Reverse a string. */
export function reverse(s) {
  return [...String(s)].reverse().join("");
}

/**
 * Lower-case a string and join whitespace-separated words with single hyphens.
 */
export function kebabCase(s) {
  return String(s).trim().toLowerCase().split(/\s+/).join("-");
}
