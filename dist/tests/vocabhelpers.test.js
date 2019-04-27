"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var choose = index_1.VocabHelpers.choose;
var capitalize = index_1.VocabHelpers.capitalize;
var maybe = index_1.VocabHelpers.maybe;
var say = index_1.VocabHelpers.say;
var param = index_1.VocabHelpers.param;
var ifThen = index_1.VocabHelpers.ifThen;
var ifNot = index_1.VocabHelpers.ifNot;
var ifElse = index_1.VocabHelpers.ifElse;
var doFirst = index_1.VocabHelpers.doFirst;
test("it can create a choice template from an array of strings ", function () {
    var template = choose(["sushi", "pizza", "tacos", "{{>healthyFood}}"]);
    expect(template).toEqual("{{#choose}}sushi|pizza|tacos|{{>healthyFood}}{{/choose}}");
});
test("it can create a choice template from an array of weighted objects", function () {
    var template = choose([
        { v: "sushi", w: 2 },
        { v: "pizza", w: 3 },
        { v: "tacos", w: 4 },
        { v: "{{>healthyFood}}", w: 5 }
    ]);
    expect(template).toEqual("{{#choose}}sushi=2|pizza=3|tacos=4|{{>healthyFood}}=5{{/choose}}");
});
test("it can create a choice template from a mixed array of strings and weighted objects", function () {
    var template = choose([
        { v: "sushi", w: 2 },
        "pizza",
        { v: "tacos", w: 4 },
        "{{>healthyFood}}"
    ]);
    expect(template).toEqual("{{#choose}}sushi=2|pizza|tacos=4|{{>healthyFood}}{{/choose}}");
});
test("it can prevent choice nesting by selecting the first value (weighted)", function () {
    var template = choose([
        { v: "sushi", w: 2 },
        "pizza",
        { v: "tacos", w: 4 },
        choose(["a", "b", "c"])
    ]);
    expect(template).toEqual("sushi");
});
test("it can prevent choice nesting by selecting the first value (string)", function () {
    var template = choose([
        "pizza",
        { v: "sushi", w: 2 },
        { v: "tacos", w: 4 },
        choose(["a", "b", "c"])
    ]);
    expect(template).toEqual("pizza");
});
test("it can prevent choice nesting by selecting the first value (choose)", function () {
    var template = choose([
        choose(["a", "b", "c"]),
        "pizza",
        { v: "sushi", w: 2 },
        { v: "tacos", w: 4 }
    ]);
    expect(template).toEqual("{{#choose}}a|b|c{{/choose}}");
});
test("it can handle an empty array by returning an empty choice template", function () {
    expect(choose([])).toEqual("{{#choose}}{{/choose}}");
});
test("it can create a capitalize template for a string", function () {
    expect(capitalize("hello")).toEqual("{{#capitalize}}hello{{/capitalize}}");
    expect(capitalize("{{>greeting}}")).toEqual("{{#capitalize}}{{>greeting}}{{/capitalize}}");
});
test("it can handle an empty string by creating an empty capitalize template", function () {
    expect(capitalize("")).toEqual("{{#capitalize}}{{/capitalize}}");
});
test("it can create a maybe template", function () {
    var template = maybe(" hooray");
    expect(template).toEqual("{{#choose}} hooray|{{/choose}}");
});
test("it can create a say template which references a partial", function () {
    var template = say("greet");
    expect(template).toEqual("{{>greet}}");
});
test("it can create a param template which references a param", function () {
    var template = param("name");
    expect(template).toEqual("{{params.name}}");
});
test("it can create a ifThen template", function () {
    var template = ifThen("name", param("name"));
    expect(template).toEqual("{{#params.name}}{{params.name}}{{/params.name}}");
});
test("it can create a ifNot template", function () {
    var template = ifNot("name", "someone");
    expect(template).toEqual("{{^params.name}}someone{{/params.name}}");
});
test("it can create a ifElse template", function () {
    var template = ifElse("name", param("name"), "someone");
    expect(template).toEqual("{{#params.name}}{{params.name}}{{/params.name}}{{^params.name}}someone{{/params.name}}");
});
test("it can create a doFirst template", function () {
    var template = doFirst([
        { p: "nickname", t: param("nickname") },
        { p: "firstName", t: param("firstName") },
        { p: "lastName", t: "Mr. " + param("lastName") }
    ], "dude");
    expect(template).toEqual("{{#params.nickname}}{{params.nickname}}{{/params.nickname}}{{^params.nickname}}{{#params.firstName}}{{params.firstName}}{{/params.firstName}}{{^params.firstName}}{{#params.lastName}}Mr. {{params.lastName}}{{/params.lastName}}{{^params.lastName}}dude{{/params.lastName}}{{/params.firstName}}{{/params.nickname}}");
});
