import test from "node:test";
import assert from "node:assert/strict";
import { reverse, kebabCase } from "../src/strings.js";

test("reverse: basic", () => {
  assert.equal(reverse("abc"), "cba");
});

test("reverse: empty", () => {
  assert.equal(reverse(""), "");
});

test("kebabCase: normal sentence", () => {
  assert.equal(kebabCase("Hello World"), "hello-world");
});

test("kebabCase: single word", () => {
  assert.equal(kebabCase("Foo"), "foo");
});

test("kebabCase: already kebab-cased", () => {
  assert.equal(kebabCase("already-kebab-case"), "already-kebab-case");
});

test("kebabCase: empty string", () => {
  assert.equal(kebabCase(""), "");
});
