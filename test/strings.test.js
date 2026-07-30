import test from "node:test";
import assert from "node:assert/strict";
import { reverse } from "../src/strings.js";

test("reverse: basic", () => {
  assert.equal(reverse("abc"), "cba");
});

test("reverse: empty", () => {
  assert.equal(reverse(""), "");
});
