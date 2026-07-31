import test from "node:test";
import assert from "node:assert/strict";
import {
  chunk,
  unique,
  flatten,
  groupBy,
  partition,
  zip,
  range,
  countBy,
  intersection,
  difference,
} from "../src/collections.js";

// ---------------------------------------------------------------------------
// chunk
// ---------------------------------------------------------------------------
test("chunk: basic split", () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
});

test("chunk: exact size", () => {
  assert.deepEqual(chunk([1, 2, 3, 4], 2), [[1, 2], [3, 4]]);
});

test("chunk: size larger than array", () => {
  assert.deepEqual(chunk([1, 2], 10), [[1, 2]]);
});

test("chunk: empty array", () => {
  assert.deepEqual(chunk([], 3), []);
});

test("chunk: single element", () => {
  assert.deepEqual(chunk([42], 1), [[42]]);
});

test("chunk: size 1", () => {
  assert.deepEqual(chunk([1, 2, 3], 1), [[1], [2], [3]]);
});

test("chunk: invalid size throws", () => {
  assert.throws(() => chunk([1], 0), RangeError);
  assert.throws(() => chunk([1], -1), RangeError);
  assert.throws(() => chunk([1], 1.5), RangeError);
});

// ---------------------------------------------------------------------------
// unique
// ---------------------------------------------------------------------------
test("unique: basic", () => {
  assert.deepEqual(unique([1, 2, 2, 3, 1, 4]), [1, 2, 3, 4]);
});

test("unique: empty", () => {
  assert.deepEqual(unique([]), []);
});

test("unique: single element", () => {
  assert.deepEqual(unique([7]), [7]);
});

test("unique: all duplicates", () => {
  assert.deepEqual(unique(["a", "a", "a"]), ["a"]);
});

test("unique: preserves first-seen order", () => {
  assert.deepEqual(unique([3, 1, 2, 1, 3]), [3, 1, 2]);
});

test("unique: mixed types", () => {
  assert.deepEqual(unique([1, "1", 1, "1"]), [1, "1"]);
});

// ---------------------------------------------------------------------------
// flatten
// ---------------------------------------------------------------------------
test("flatten: basic", () => {
  assert.deepEqual(flatten([1, [2, 3], [4], 5]), [1, 2, 3, 4, 5]);
});

test("flatten: empty", () => {
  assert.deepEqual(flatten([]), []);
});

test("flatten: single element", () => {
  assert.deepEqual(flatten([42]), [42]);
});

test("flatten: no nesting", () => {
  assert.deepEqual(flatten([1, 2, 3]), [1, 2, 3]);
});

test("flatten: only one level (not deep)", () => {
  assert.deepEqual(flatten([[1, [2, 3]], [4]]), [1, [2, 3], 4]);
});

test("flatten: empty sub-arrays", () => {
  assert.deepEqual(flatten([[1], [], [2]]), [1, 2]);
});

// ---------------------------------------------------------------------------
// groupBy
// ---------------------------------------------------------------------------
test("groupBy: basic", () => {
  const result = groupBy([1, 2, 3, 4, 5, 6], (n) => (n % 2 === 0 ? "even" : "odd"));
  assert.deepEqual(result, { odd: [1, 3, 5], even: [2, 4, 6] });
});

test("groupBy: empty", () => {
  assert.deepEqual(groupBy([], (n) => n), {});
});

test("groupBy: single element", () => {
  assert.deepEqual(groupBy([5], (n) => (n > 0 ? "pos" : "neg")), { pos: [5] });
});

test("groupBy: all same key", () => {
  assert.deepEqual(groupBy(["a", "b", "c"], () => "key"), { key: ["a", "b", "c"] });
});

test("groupBy: preserves insertion order per key", () => {
  const result = groupBy([3, 1, 2], (n) => "all");
  assert.deepEqual(result, { all: [3, 1, 2] });
});

// ---------------------------------------------------------------------------
// partition
// ---------------------------------------------------------------------------
test("partition: basic", () => {
  const [pass, fail] = partition([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0);
  assert.deepEqual(pass, [2, 4, 6]);
  assert.deepEqual(fail, [1, 3, 5]);
});

test("partition: empty", () => {
  const [pass, fail] = partition([], (n) => n);
  assert.deepEqual(pass, []);
  assert.deepEqual(fail, []);
});

test("partition: single element passes", () => {
  const [pass, fail] = partition([true], Boolean);
  assert.deepEqual(pass, [true]);
  assert.deepEqual(fail, []);
});

test("partition: single element fails", () => {
  const [pass, fail] = partition([false], Boolean);
  assert.deepEqual(pass, []);
  assert.deepEqual(fail, [false]);
});

test("partition: all pass", () => {
  const [pass, fail] = partition([1, 2, 3], (n) => n > 0);
  assert.deepEqual(pass, [1, 2, 3]);
  assert.deepEqual(fail, []);
});

test("partition: all fail", () => {
  const [pass, fail] = partition([1, 2, 3], (n) => n > 10);
  assert.deepEqual(pass, []);
  assert.deepEqual(fail, [1, 2, 3]);
});

// ---------------------------------------------------------------------------
// zip
// ---------------------------------------------------------------------------
test("zip: equal length", () => {
  assert.deepEqual(zip([1, 2, 3], ["a", "b", "c"]), [[1, "a"], [2, "b"], [3, "c"]]);
});

test("zip: empty", () => {
  assert.deepEqual(zip([], []), []);
});

test("zip: first longer", () => {
  assert.deepEqual(zip([1, 2, 3], ["a", "b"]), [[1, "a"], [2, "b"]]);
});

test("zip: second longer", () => {
  assert.deepEqual(zip([1, 2], ["a", "b", "c"]), [[1, "a"], [2, "b"]]);
});

test("zip: first empty", () => {
  assert.deepEqual(zip([], [1, 2, 3]), []);
});

test("zip: second empty", () => {
  assert.deepEqual(zip([1, 2, 3], []), []);
});

test("zip: single element", () => {
  assert.deepEqual(zip([1], ["a"]), [[1, "a"]]);
});

// ---------------------------------------------------------------------------
// range
// ---------------------------------------------------------------------------
test("range: basic positive step", () => {
  assert.deepEqual(range(0, 5), [0, 1, 2, 3, 4]);
});

test("range: empty (start >= end with positive step)", () => {
  assert.deepEqual(range(5, 0), []);
});

test("range: negative step", () => {
  assert.deepEqual(range(5, 0, -1), [5, 4, 3, 2, 1]);
});

test("range: step larger than span", () => {
  assert.deepEqual(range(0, 10, 100), [0]);
});

test("range: single element", () => {
  assert.deepEqual(range(3, 4), [3]);
});

test("range: empty with negative step (start < end)", () => {
  assert.deepEqual(range(0, 5, -1), []);
});

test("range: zero step throws", () => {
  assert.throws(() => range(0, 5, 0), RangeError);
});

test("range: custom step 3", () => {
  assert.deepEqual(range(0, 10, 3), [0, 3, 6, 9]);
});

// ---------------------------------------------------------------------------
// countBy
// ---------------------------------------------------------------------------
test("countBy: basic", () => {
  assert.deepEqual(
    countBy(["apple", "banana", "apricot", "cherry", "avocado"], (s) => s[0]),
    { a: 3, b: 1, c: 1 },
  );
});

test("countBy: empty", () => {
  assert.deepEqual(countBy([], (n) => n), {});
});

test("countBy: single element", () => {
  assert.deepEqual(countBy([42], (n) => "num"), { num: 1 });
});

test("countBy: all same", () => {
  assert.deepEqual(countBy([1, 1, 1, 1], (n) => n), { 1: 4 });
});

test("countBy: truthy/falsy keys", () => {
  assert.deepEqual(countBy([1, 0, 1, 0], Boolean), { true: 2, false: 2 });
});

// ---------------------------------------------------------------------------
// intersection
// ---------------------------------------------------------------------------
test("intersection: basic", () => {
  assert.deepEqual(intersection([1, 2, 3, 4], [3, 4, 5, 6]), [3, 4]);
});

test("intersection: empty first", () => {
  assert.deepEqual(intersection([], [1, 2]), []);
});

test("intersection: empty second", () => {
  assert.deepEqual(intersection([1, 2], []), []);
});

test("intersection: both empty", () => {
  assert.deepEqual(intersection([], []), []);
});

test("intersection: no overlap", () => {
  assert.deepEqual(intersection([1, 2], [3, 4]), []);
});

test("intersection: preserves order of first", () => {
  assert.deepEqual(intersection([3, 1, 2], [2, 3, 4]), [3, 2]);
});

test("intersection: duplicates in first", () => {
  assert.deepEqual(intersection([1, 2, 1, 3], [1, 3]), [1, 3]);
});

test("intersection: single element match", () => {
  assert.deepEqual(intersection([5], [5]), [5]);
});

// ---------------------------------------------------------------------------
// difference
// ---------------------------------------------------------------------------
test("difference: basic", () => {
  assert.deepEqual(difference([1, 2, 3, 4], [2, 4]), [1, 3]);
});

test("difference: empty first", () => {
  assert.deepEqual(difference([], [1, 2]), []);
});

test("difference: empty second", () => {
  assert.deepEqual(difference([1, 2], []), [1, 2]);
});

test("difference: both empty", () => {
  assert.deepEqual(difference([], []), []);
});

test("difference: full overlap", () => {
  assert.deepEqual(difference([1, 2, 3], [1, 2, 3]), []);
});

test("difference: no overlap", () => {
  assert.deepEqual(difference([1, 2], [3, 4]), [1, 2]);
});

test("difference: preserves order", () => {
  assert.deepEqual(difference([4, 1, 3, 2], [1, 2]), [4, 3]);
});

test("difference: duplicates in first", () => {
  assert.deepEqual(difference([1, 2, 1, 3], [1]), [2, 3]);
});

test("difference: single element", () => {
  assert.deepEqual(difference([7], [7]), []);
  assert.deepEqual(difference([7], [8]), [7]);
});