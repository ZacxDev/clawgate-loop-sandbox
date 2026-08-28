import test from "node:test";
import assert from "node:assert/strict";
import { clamp } from "../src/math.js";

test("clamp: returns value when within range", () => {
  assert.equal(clamp(5, 0, 10), 5);
});

test("clamp: returns min when value < min", () => {
  assert.equal(clamp(-3, 0, 10), 0);
});

test("clamp: returns max when value > max", () => {
  assert.equal(clamp(15, 0, 10), 10);
});

test("clamp: returns value when value === min (boundary)", () => {
  assert.equal(clamp(0, 0, 10), 0);
});

test("clamp: returns value when value === max (boundary)", () => {
  assert.equal(clamp(10, 0, 10), 10);
});

test("clamp: works with negative range", () => {
  assert.equal(clamp(-5, -10, -1), -5);
  assert.equal(clamp(-15, -10, -1), -10);
  assert.equal(clamp(0, -10, -1), -1);
});

test("clamp: min equals max", () => {
  assert.equal(clamp(5, 3, 3), 3);
  assert.equal(clamp(3, 3, 3), 3);
});
