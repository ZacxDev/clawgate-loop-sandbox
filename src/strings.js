// Small pure string helpers. Zero dependencies by design — `node --test` is
// built in, so an agent can run the suite with no network and no install step.

/** Reverse a string. */
export function reverse(s) {
  return [...String(s)].reverse().join("");
}

/**
 * Slugify a string: lowercase, trim, collapse runs of non-alphanumeric
 * characters to a single "-", and strip leading/trailing "-".
 */
export function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
