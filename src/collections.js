// Pure array/collection helpers. Zero dependencies — `node --test` is built in.

/** Split an array into chunks of `size`; the last chunk may be shorter. */
export function chunk(arr, size) {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError("size must be a positive integer");
  }
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/** Return unique elements preserving first-seen order. */
export function unique(arr) {
  const seen = new Set();
  const result = [];
  for (const item of arr) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

/** Flatten one level of nesting. */
export function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...item);
    } else {
      result.push(item);
    }
  }
  return result;
}

/** Group array elements by the key returned by `fn`. Returns an object of key → array. */
export function groupBy(arr, fn) {
  const result = {};
  for (const item of arr) {
    const key = fn(item);
    if (!Object.hasOwn(result, key)) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}

/** Partition into [pass, fail] based on predicate. */
export function partition(arr, pred) {
  const pass = [];
  const fail = [];
  for (const item of arr) {
    (pred(item) ? pass : fail).push(item);
  }
  return [pass, fail];
}

/** Zip two arrays into pairs, truncating to the shorter. */
export function zip(a, b) {
  const len = Math.min(a.length, b.length);
  const result = [];
  for (let i = 0; i < len; i++) {
    result.push([a[i], b[i]]);
  }
  return result;
}

/** Generate an array of numbers from `start` (inclusive) to `end` (exclusive) by `step`. */
export function range(start, end, step = 1) {
  if (step === 0) {
    throw new RangeError("step must be non-zero");
  }
  const result = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }
  return result;
}

/** Count occurrences by the key returned by `fn`. Returns an object of key → count. */
export function countBy(arr, fn) {
  const result = {};
  for (const item of arr) {
    const key = fn(item);
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}

/** Elements present in both `a` and `b`, preserving order of `a`. */
export function intersection(a, b) {
  const setB = new Set(b);
  const result = [];
  const seen = new Set();
  for (const item of a) {
    if (setB.has(item) && !seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

/** Elements in `a` not in `b`, preserving order of `a`. */
export function difference(a, b) {
  const setB = new Set(b);
  const result = [];
  for (const item of a) {
    if (!setB.has(item)) {
      result.push(item);
    }
  }
  return result;
}