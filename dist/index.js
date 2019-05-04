"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var random_seed_weighted_chooser_1 = __importDefault(require("random-seed-weighted-chooser"));
var toWeightedTexts = function (texts) {
    return texts.map(function (val) {
        if (typeof val === "string") {
            return { t: val, w: 1 };
        }
        return val;
    });
};
var Persona = /** @class */ (function () {
    function Persona() {
        var _this = this;
        this.articulate = function (vocabKey, params) {
            if (params === void 0) { params = {}; }
            return _this.say(vocabKey, params);
        };
        this.say = function (vocabKey, params) {
            if (params === void 0) { params = _this.params; }
            _this.params = params;
            var val = _this.vocab[vocabKey];
            if (typeof val === "undefined") {
                console.warn('Vocab key "' + vocabKey + '" not found. Using empty string.');
            }
            return _this.render(val);
        };
        this.capitalize = function (text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        };
        this.sb = function (text) {
            return " " + text;
        };
        this.sa = function (text) {
            return text + " ";
        };
        this.sba = function (text) {
            return " " + text + " ";
        };
        this.capSay = function (vocabKey, params) {
            if (params === void 0) { params = _this.params; }
            return _this.capitalize(_this.say(vocabKey, params));
        };
        this.render = function (val) {
            if (typeof val === "function") {
                // Call it and render the value, which could be anything.
                return _this.render(val());
            }
            else if (typeof val === "string") {
                return val;
            }
            else if (!!val) {
                return val + "";
            }
            else {
                return "";
            }
        };
        this.choose = function () {
            var texts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                texts[_i] = arguments[_i];
            }
            var weightedTexts = toWeightedTexts(texts);
            var choice = random_seed_weighted_chooser_1.default.chooseWeightedObject(weightedTexts, "w");
            if (!!choice && typeof choice["t"] !== "undefined") {
                return _this.render(choice["t"]);
            }
            else {
                console.warn("Choice returned a bad value for:", texts);
                return "";
            }
        };
        this.weighted = function (text, weight) {
            if (weight === void 0) { weight = 1; }
            return { t: text, w: weight };
        };
        this.chance = function (text, chance) {
            chance = Math.min(1, Math.max(0, chance));
            var noopChance = Math.min(1, Math.max(0, 1 - chance));
            var textWeighted = { t: text, w: chance };
            var noopWeighted = { t: "", w: noopChance };
            return _this.choose(noopWeighted, textWeighted);
        };
        this.cycle = function (group) {
            var texts = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                texts[_i - 1] = arguments[_i];
            }
            var weightedTexts = toWeightedTexts(texts);
            var cycledTexts = _this.getCycledTextsFor(group.group);
            var filtered = weightedTexts.filter(function (val) {
                return val.w !== 0 && !cycledTexts.includes(val.t);
            });
            // If they've all been used...
            if (filtered.length === 0) {
                // Choose from any of them
                filtered = weightedTexts;
                // And remove all items from the cycled texts array
                weightedTexts.forEach(function (val) {
                    var index = cycledTexts.indexOf(val.t);
                    if (index >= 0) {
                        cycledTexts.splice(index, 1);
                    }
                });
            }
            //console.log(group.group, "Choosing from:", filtered, "Used up:", cycledTexts);
            var chosen = _this.choose.apply(_this, filtered);
            cycledTexts.push(chosen);
            //console.log(group.group, "Choice:", chosen, "Used up after choice:", cycledTexts);
            return chosen;
        };
        this.maybe = function () {
            var texts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                texts[_i] = arguments[_i];
            }
            return _this.choose("", _this.choose.apply(_this, texts));
        };
        this.param = function (paramKey) {
            var val = _this.params[paramKey];
            return _this.render(val);
        };
        this.ifThen = function (paramKey, then) {
            return _this.ifElse(paramKey, then, "");
        };
        this.ifNot = function (paramKey, then) {
            return _this.ifElse(paramKey, "", then);
        };
        this.ifElse = function (paramKey, then, otherwise) {
            if (!!_this.params[paramKey]) {
                return _this.render(then);
            }
            else {
                return _this.render(otherwise);
            }
        };
        this.doFirst = function (paramTextPairs, defaultText) {
            if (defaultText === void 0) { defaultText = ""; }
            for (var i = 0; i < paramTextPairs.length; i++) {
                var pair = paramTextPairs[i];
                var paramKey = pair.p;
                var value = pair.t;
                if (!!_this.params[paramKey]) {
                    return _this.render(value);
                }
            }
            return _this.render(defaultText);
        };
        this.vocab = {};
        this.params = {};
        this.cycledTextsGroups = {};
    }
    Persona.prototype.getCycledTextsFor = function (groupName) {
        var cycledTexts = this.cycledTextsGroups[groupName];
        if (!!cycledTexts) {
            return cycledTexts;
        }
        else {
            this.cycledTextsGroups[groupName] = [];
            return this.cycledTextsGroups[groupName];
        }
    };
    return Persona;
}());
exports.default = Persona;
/*
class Justin extends Persona {
  createVocab = () => {
    let say = this.say;
    let capSay = this.capSay;
    let choose = this.choose;
    let maybe = this.maybe;
    let cycle = this.cycle;
    let param = this.param;
    let doFirst = this.doFirst;
    return {
      greet: (): string =>
        capSay("hi") +
        "-" +
        cycle("1", "2", "3", "4", "5") +
        "-" +
        cycle("2", "1", "3", "4", "5") +
        "-" +
        choose("hi", "hey", "hello", "what's up") +
        "-" +
        maybe(say("hi")) +
        say("name") +
        doFirst([{ p: "name", t: say("name") }], "not found"),
      hi: () => "hiiii",
      num: () => 6,
      name: (): string => param("name")
    };
  };
  vocab = this.createVocab();
}

let justin = new Justin();
let count = 100;
new Array(count).fill(0).forEach(() => {
  let params = { name: "justin" };
  console.log(justin.say("greet", params));
});
*/
