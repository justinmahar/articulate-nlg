"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../index"));
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.createVocab = function () {
            var say = _this.say;
            var capitalize = _this.capitalize;
            var sb = _this.sb;
            var sa = _this.sa;
            var sba = _this.sba;
            var capSay = _this.capSay;
            var choose = _this.choose;
            var weighted = _this.weighted;
            var chance = _this.chance;
            var cycle = _this.cycle;
            var maybe = _this.maybe;
            var param = _this.param;
            var ifThen = _this.ifThen;
            var ifNot = _this.ifNot;
            var ifElse = _this.ifElse;
            var doFirst = _this.doFirst;
            return {
                howl: function () { return "howl"; },
                howlCap: function () { return capitalize(say("howl")); },
                sbHowl: function () { return sb(say("howl")); },
                saHowl: function () { return sa(say("howl")); },
                sbaHowl: function () { return sba(say("howl")); },
                capSayGreet: function () { return capSay("greet"); },
                capSayNameWithParams: function () { return capSay("paramName", { name: "Justin" }); },
                greet: function () { return choose("woof", "bark", "ruff"); },
                greetWeighted: function () {
                    return choose(weighted("woof", 100000), weighted("bark", 0.00001), weighted("ruff", 0.00001));
                },
                chanceHowl: function () { return chance(say("howl"), 0.8); },
                cycleGreet: function () { return cycle({ group: "greet" }, "woof", "bark", "ruff"); },
                maybeGreet: function () { return maybe(say("greet")); },
                maybeDigMultiple: function () { return maybe("scratch", "dig", "burrow"); },
                paramName: function () { return param("name"); },
                ifThenAngryHowl: function () { return ifThen("angry", say("howl")); },
                ifNotAngrySniff: function () { return ifNot("angry", "sniff"); },
                ifElseAngryHowlWagTail: function () { return ifElse("angry", say("howl"), "wag tail"); },
                doFirstAngryHowlHappyWagTail: function () {
                    return doFirst([
                        { p: "angry", t: say("howl") },
                        { p: "happy", t: "wag tail" }
                    ]);
                },
                doFirstAngryHowlHappyWagTailElseWhine: function () {
                    return doFirst([{ p: "angry", t: say("howl") }, { p: "happy", t: "wag tail" }], "whine");
                },
                paramNumber: function () { return param("number"); }
            };
        };
        _this.vocab = _this.createVocab();
        return _this;
    }
    return Dog;
}(index_1.default));
var max = new Dog();
beforeEach(function () {
    max = new Dog();
});
test("it can articulate concepts", function () {
    expect(max.articulate("howl")).toEqual("howl");
});
test("it can capitalize text", function () {
    expect(max.articulate("howlCap")).toEqual("Howl");
});
test("it can add a space before text", function () {
    expect(max.articulate("sbHowl")).toEqual(" howl");
});
test("it can add a space after text", function () {
    expect(max.articulate("saHowl")).toEqual("howl ");
});
test("it can add a space before and after text in one step", function () {
    expect(max.articulate("sbaHowl")).toEqual(" howl ");
});
test("it can choose an item randomly", function () {
    expect(["woof", "bark", "ruff"]).toContain(max.articulate("greet"));
});
test("it can choose an item randomly with some being weighted differently", function () {
    expect(["woof"]).toContain(max.articulate("greetWeighted"));
});
test("it can say and capitalize text in one step", function () {
    Array.from({ length: 10 }).forEach(function () {
        expect(["Woof", "Bark", "Ruff"]).toContain(max.articulate("capSayGreet"));
    });
});
test("it can generate text based on a chance probability", function () {
    Array.from({ length: 10 }).forEach(function () {
        expect(["howl", ""]).toContain(max.articulate("chanceHowl"));
    });
});
test("it can randomly cycle through text, preventing repeats until all options are exhausted", function () {
    Array.from({ length: 10 }).forEach(function () {
        // Possible values: "woof", "bark", "ruff"
        var cycledValues = [];
        var nextVal = max.articulate("cycleGreet");
        //console.log("chose '", nextVal);
        expect(["woof", "bark", "ruff"]).toContain(nextVal);
        cycledValues.push(nextVal);
        //console.log("All so far: ", cycledValues);
        // possible values: 2 of 3
        nextVal = max.articulate("cycleGreet");
        //console.log("chose '", nextVal);
        expect(cycledValues).not.toContain(nextVal);
        cycledValues.push(nextVal);
        //console.log("All so far: ", cycledValues);
        // possible values: 1 of 3
        nextVal = max.articulate("cycleGreet");
        //console.log("chose '", nextVal);
        expect(cycledValues).not.toContain(nextVal);
        cycledValues.push(nextVal);
        //console.log("All so far: ", cycledValues);
        // Starting over. Possible values: "woof", "bark", "ruff"
        cycledValues = [];
        //console.log("Cleared:", cycledValues);
        nextVal = max.articulate("cycleGreet");
        //console.log("chose '", nextVal);
        expect(["woof", "bark", "ruff"]).toContain(nextVal);
        cycledValues.push(nextVal);
        //console.log("All so far: ", cycledValues);
        // possible values: 2 of 3
        nextVal = max.articulate("cycleGreet");
        expect(cycledValues).not.toContain(nextVal);
        cycledValues.push(nextVal);
        // possible values: 1 of 3
        nextVal = max.articulate("cycleGreet");
        expect(cycledValues).not.toContain(nextVal);
    });
});
test('it can "maybe" output text, giving it a 50/50 chance empty string or the text provided', function () {
    Array.from({ length: 10 }).forEach(function () {
        expect(["woof", "bark", "ruff", ""]).toContain(max.articulate("maybeGreet"));
    });
});
test('it can "maybe" output text, giving it a 50/50 chance empty string or one of the texts provided', function () {
    Array.from({ length: 10 }).forEach(function () {
        expect(["scratch", "dig", "burrow", ""]).toContain(max.articulate("maybeDigMultiple"));
    });
});
test("it can use the text of a provided parameter as a string", function () {
    var result = max.articulate("paramName", { name: "Justin" });
    expect(result).toEqual("Justin");
});
test("it uses empty string when a param string is not found", function () {
    var result = max.articulate("paramName", { blahblah: "nonsense" });
    expect(result).toEqual("");
});
test("it calls the function when a param is a function", function () {
    var result = max.articulate("paramName", { name: function () { return "Justin"; } });
    expect(result).toEqual("Justin");
});
test("it will use if-then to render text if a param is truthy", function () {
    var result = max.articulate("ifThenAngryHowl", { angry: true });
    expect(result).toEqual("howl");
    result = max.articulate("ifThenAngryHowl", { angry: false });
    expect(result).toEqual("");
});
test("it will use if-not to render text if a param is falsy", function () {
    var result = max.articulate("ifNotAngrySniff", { angry: false });
    expect(result).toEqual("sniff");
    result = max.articulate("ifNotAngrySniff", { angry: true });
    expect(result).toEqual("");
});
test("it will use if-else to render text if a param is truthy and text if param is falsy", function () {
    var result = max.articulate("ifElseAngryHowlWagTail", { angry: true });
    expect(result).toEqual("howl");
    result = max.articulate("ifElseAngryHowlWagTail", { angry: false });
    expect(result).toEqual("wag tail");
});
test("it will use text for the first param that is truthy and empty string if none are truthy", function () {
    var result = max.articulate("doFirstAngryHowlHappyWagTail", {
        angry: true,
        happy: false
    });
    expect(result).toEqual("howl");
    result = max.articulate("doFirstAngryHowlHappyWagTail", { angry: true });
    expect(result).toEqual("howl");
    result = max.articulate("doFirstAngryHowlHappyWagTail", {
        angry: false,
        happy: true
    });
    expect(result).toEqual("wag tail");
    result = max.articulate("doFirstAngryHowlHappyWagTail", { happy: true });
    expect(result).toEqual("wag tail");
    result = max.articulate("doFirstAngryHowlHappyWagTail");
    expect(result).toEqual("");
});
test("it will use text for the first param that is truthy and the provided string if none are truthy", function () {
    var result = max.articulate("doFirstAngryHowlHappyWagTailElseWhine", {
        angry: true,
        happy: false
    });
    expect(result).toEqual("howl");
    result = max.articulate("doFirstAngryHowlHappyWagTailElseWhine", {
        angry: true
    });
    expect(result).toEqual("howl");
    result = max.articulate("doFirstAngryHowlHappyWagTailElseWhine", {
        angry: false,
        happy: true
    });
    expect(result).toEqual("wag tail");
    result = max.articulate("doFirstAngryHowlHappyWagTailElseWhine", {
        happy: true
    });
    expect(result).toEqual("wag tail");
    result = max.articulate("doFirstAngryHowlHappyWagTailElseWhine", {
        angry: false,
        happy: false
    });
    expect(result).toEqual("whine");
    result = max.articulate("doFirstAngryHowlHappyWagTailElseWhine");
    expect(result).toEqual("whine");
});
test("it will return an empty string if a concept is not found", function () {
    var result = max.articulate("this-key-is-supposed-to-be-missing");
    expect(result).toEqual("");
});
test("it will render non-string, non-function params as strings", function () {
    var result = max.articulate("paramNumber", { number: 12345 });
    expect(result).toEqual("12345");
});
test("it will accept and use params when calling capSay", function () {
    var result = max.articulate("capSayNameWithParams", { name: "justin" });
    expect(result).toEqual("Justin");
});
