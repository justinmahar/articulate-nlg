"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var random_seed_weighted_chooser_1 = __importDefault(require("random-seed-weighted-chooser"));
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
var hashCode = function (text) {
    var hash = 0, i, chr;
    if (text.length === 0)
        return hash;
    for (i = 0; i < text.length; i++) {
        chr = text.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
var toWeightedVocabs = function (texts) {
    return texts.map(function (val) {
        if (typeof val === "string") {
            return { t: val, w: 1 };
        }
        return val;
    });
};
var Persona = /** @class */ (function () {
    function Persona(vocab, params, cycledTextsGroups) {
        var _this = this;
        if (vocab === void 0) { vocab = {}; }
        if (params === void 0) { params = {}; }
        if (cycledTextsGroups === void 0) { cycledTextsGroups = {}; }
        this.vocab = vocab;
        this.params = params;
        this.cycledTextsGroups = cycledTextsGroups;
        this.say = function (vocabKey, params) {
            if (params === void 0) { params = _this.params; }
            _this.params = params;
            var val = _this.vocab[vocabKey];
            return _this.render(val);
        };
        this.capitalize = function (text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
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
            var weightedVocabs = toWeightedVocabs(texts);
            var choice = random_seed_weighted_chooser_1.default.chooseWeightedObject(weightedVocabs, "w");
            return _this.render(choice["t"]);
        };
        this.cycle = function () {
            var texts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                texts[_i] = arguments[_i];
            }
            var weightedVocabs = toWeightedVocabs(texts);
            // Create a hash that's used to group the items provided.
            // This prevents global cycling and increases search performance.
            var textsHash = hashCode(weightedVocabs.map(function (val) { return val.t; }).join("")) + "";
            var cycledTexts = _this.getCycledTextsFor(textsHash);
            // console.log(textsHash, cycledTexts);
            var filtered = weightedVocabs.filter(function (val) {
                return !cycledTexts.includes(val.t);
            });
            // If they've all been used...
            if (filtered.length === 0) {
                // Choose from any of them
                filtered = weightedVocabs;
                // And remove all items from the cycled texts array
                weightedVocabs.forEach(function (val) {
                    var index = cycledTexts.indexOf(val.t);
                    if (index >= 0) {
                        cycledTexts.splice(index, 1);
                    }
                });
            }
            var chosen = _this.choose.apply(_this, filtered);
            cycledTexts.push(chosen);
            return chosen;
        };
        this.maybe = function (text) {
            return _this.choose("", text);
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
            return defaultText;
        };
    }
    Persona.prototype.getCycledTextsFor = function (hash) {
        var cycledTexts = this.cycledTextsGroups[hash];
        if (!!cycledTexts) {
            return cycledTexts;
        }
        else {
            this.cycledTextsGroups[hash] = [];
            return this.cycledTextsGroups[hash];
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
      hi: "hiiii",
      num: 6,
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
