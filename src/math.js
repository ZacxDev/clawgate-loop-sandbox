// Small pure math helpers. Zero dependencies by design.

/** Clamp a value between min and max (inclusive). */
export function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
