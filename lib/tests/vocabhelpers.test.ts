import { VocabHelpers } from "../index";

const choose = VocabHelpers.choose;
const capitalize = VocabHelpers.capitalize;
const maybe = VocabHelpers.maybe;
const say = VocabHelpers.say;
const param = VocabHelpers.param;
const ifThen = VocabHelpers.ifThen;
const ifNot = VocabHelpers.ifNot;
const ifElse = VocabHelpers.ifElse;
const doFirst = VocabHelpers.doFirst;

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

test("it can prevent choice nesting by selecting the first value (weighted)", () => {
  let template = choose([
    { v: "sushi", w: 2 },
    "pizza",
    { v: "tacos", w: 4 },
    choose(["a", "b", "c"])
  ]);
  expect(template).toEqual("sushi");
});

test("it can prevent choice nesting by selecting the first value (string)", () => {
  let template = choose([
    "pizza",
    { v: "sushi", w: 2 },
    { v: "tacos", w: 4 },
    choose(["a", "b", "c"])
  ]);
  expect(template).toEqual("pizza");
});

test("it can prevent choice nesting by selecting the first value (choose)", () => {
  let template = choose([
    choose(["a", "b", "c"]),
    "pizza",
    { v: "sushi", w: 2 },
    { v: "tacos", w: 4 }
  ]);
  expect(template).toEqual("{{#choose}}a|b|c{{/choose}}");
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

test("it can create a maybe template", () => {
  let template = maybe(" hooray");
  expect(template).toEqual("{{#choose}} hooray|{{/choose}}");
});

test("it can create a say template which references a partial", () => {
  let template = say("greet");
  expect(template).toEqual("{{>greet}}");
});

test("it can create a param template which references a param", () => {
  let template = param("name");
  expect(template).toEqual("{{params.name}}");
});

test("it can create a ifThen template", () => {
  let template = ifThen("name", param("name"));
  expect(template).toEqual("{{#params.name}}{{params.name}}{{/params.name}}");
});

test("it can create a ifNot template", () => {
  let template = ifNot("name", "someone");
  expect(template).toEqual("{{^params.name}}someone{{/params.name}}");
});

test("it can create a ifElse template", () => {
  let template = ifElse("name", param("name"), "someone");
  expect(template).toEqual(
    "{{#params.name}}{{params.name}}{{/params.name}}{{^params.name}}someone{{/params.name}}"
  );
});

test("it can create a doFirst template", () => {
  let template = doFirst(
    [
      { p: "nickname", t: param("nickname") },
      { p: "firstName", t: param("firstName") },
      { p: "lastName", t: "Mr. " + param("lastName") }
    ],
    "dude"
  );
  expect(template).toEqual(
    "{{#params.nickname}}{{params.nickname}}{{/params.nickname}}{{^params.nickname}}{{#params.firstName}}{{params.firstName}}{{/params.firstName}}{{^params.firstName}}{{#params.lastName}}Mr. {{params.lastName}}{{/params.lastName}}{{^params.lastName}}dude{{/params.lastName}}{{/params.firstName}}{{/params.nickname}}"
  );
});

test("it can create a doFirst template and fall back to empty string", () => {
  let template = doFirst(
    [
      { p: "nickname", t: param("nickname") },
      { p: "firstName", t: param("firstName") },
      { p: "lastName", t: "Mr. " + param("lastName") }
    ]
  );
  expect(template).toEqual(
    "{{#params.nickname}}{{params.nickname}}{{/params.nickname}}{{^params.nickname}}{{#params.firstName}}{{params.firstName}}{{/params.firstName}}{{^params.firstName}}{{#params.lastName}}Mr. {{params.lastName}}{{/params.lastName}}{{^params.lastName}}{{/params.lastName}}{{/params.firstName}}{{/params.nickname}}"
  );
});
