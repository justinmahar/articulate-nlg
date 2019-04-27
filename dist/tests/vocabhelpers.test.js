"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var choose = index_1.VocabHelpers.choose;
var capitalize = index_1.VocabHelpers.capitalize;
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
