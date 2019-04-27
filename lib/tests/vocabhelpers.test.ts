import { VocabHelpers } from "../index";

const choose = VocabHelpers.choose;
const capitalize = VocabHelpers.capitalize;

test("it can create a choice template from an array of strings ", () => {
  let template = choose(["sushi", "pizza", "tacos", "{{>healthyFood}}"]);
  expect(template).toEqual(
    "{{#choose}}sushi|pizza|tacos|{{>healthyFood}}{{/choose}}"
  );
});

test("it can create a choice template from an array of weighted objects", () => {
  let template = choose([
    { v: "sushi", w: 2 },
    { v: "pizza", w: 3 },
    { v: "tacos", w: 4 },
    { v: "{{>healthyFood}}", w: 5 }
  ]);
  expect(template).toEqual(
    "{{#choose}}sushi=2|pizza=3|tacos=4|{{>healthyFood}}=5{{/choose}}"
  );
});

test("it can create a choice template from a mixed array of strings and weighted objects", () => {
  let template = choose([
    { v: "sushi", w: 2 },
    "pizza",
    { v: "tacos", w: 4 },
    "{{>healthyFood}}"
  ]);
  expect(template).toEqual(
    "{{#choose}}sushi=2|pizza|tacos=4|{{>healthyFood}}{{/choose}}"
  );
});

test("it can handle an empty array by returning an empty choice template", () => {
  expect(choose([])).toEqual("{{#choose}}{{/choose}}");
});

test("it can create a capitalize template for a string", () => {
  expect(capitalize("hello")).toEqual("{{#capitalize}}hello{{/capitalize}}");
  expect(capitalize("{{>greeting}}")).toEqual(
    "{{#capitalize}}{{>greeting}}{{/capitalize}}"
  );
});

test("it can handle an empty string by creating an empty capitalize template", () => {
  expect(capitalize("")).toEqual("{{#capitalize}}{{/capitalize}}");
});
