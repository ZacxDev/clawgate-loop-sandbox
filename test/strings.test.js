import test from "node:test";
import assert from "node:assert/strict";
import { reverse, slugify } from "../src/strings.js";

test("reverse: basic", () => {
  assert.equal(reverse("abc"), "cba");
});

test("reverse: empty", () => {
  assert.equal(reverse(""), "");
});

// ── slugify ────────────────────────────────────────────────

test("slugify: normal sentence", () => {
  assert.equal(slugify("Hello World"), "hello-world");
});

test("slugify: punctuation", () => {
  assert.equal(slugify("What's up???"), "what-s-up");
});

test("slugify: entirely punctuation", () => {
  assert.equal(slugify("!!!--???"), "");
});

test("slugify: empty string", () => {
  assert.equal(slugify(""), "");
});