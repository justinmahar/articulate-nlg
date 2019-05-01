"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mustache_1 = __importDefault(require("mustache"));
var random_seed_weighted_chooser_1 = __importDefault(require("random-seed-weighted-chooser"));
var defaultCore = {
    capitalize: function () {
        return function (text, render) {
            var renderedText = render(text);
            return renderedText.charAt(0).toUpperCase() + renderedText.slice(1);
        };
    },
    choose: function () {
        return function (text, render) {
            var segments = text.split("|");
            var segmentsWithWeights = [];
            var regex = /(.*)[=]([0-9]*[.]?[0-9]+)/;
            segments.forEach(function (segment) {
                var match = segment.match(regex);
                if (match !== null && match.length >= 2) {
                    segmentsWithWeights.push({
                        value: match[1],
                        weight: parseFloat(match[2])
                    });
                }
                else {
                    segmentsWithWeights.push({ value: segment, weight: 1 });
                }
            });
            var chosen = random_seed_weighted_chooser_1.default.chooseWeightedObject(segmentsWithWeights);
            var renderedText = render(chosen.value);
            return renderedText;
        };
    }
};
var Persona = /** @class */ (function () {
    function Persona(vocab, core) {
        var _this = this;
        if (vocab === void 0) { vocab = {}; }
        if (core === void 0) { core = defaultCore; }
        this.vocab = vocab;
        this.core = core;
        this.say = function (template, params) {
            if (params === void 0) { params = {}; }
            return mustache_1.default.render("{{>" + template + "}}", __assign({}, _this.core, { "params": params }), _this.vocab);
        };
    }
    return Persona;
}());
exports.default = Persona;
var preventNesting = function (stringToCheck, tag, returnIfValid, returnIfInvalid) {
    if (stringToCheck.indexOf(tag) >= 0) {
        console.warn("Can't nest " + tag + ". Make into another partial and reference it instead.", "Defaulting to " + returnIfInvalid, "For:", stringToCheck);
        return returnIfInvalid;
    }
    return returnIfValid;
};
var VocabHelpers = /** @class */ (function () {
    function VocabHelpers() {
    }
    VocabHelpers.capitalize = function (text) {
        return preventNesting(text, "{{#capitalize}}", "{{#capitalize}}" + text + "{{/capitalize}}", text);
    };
    VocabHelpers.choose = function (texts) {
        var firstValue = "";
        var parts = texts.map(function (val) {
            if (typeof val === "string") {
                firstValue = !!firstValue ? firstValue : val;
                return val;
            }
            else {
                firstValue = !!firstValue ? firstValue : val.v;
                return val.v + "=" + val.w;
            }
        });
        var joinedParts = parts.join("|");
        return preventNesting(joinedParts, "{{#choose}}", "{{#choose}}" + joinedParts + "{{/choose}}", firstValue);
    };
    VocabHelpers.maybe = function (text) {
        return VocabHelpers.choose([text, ""]);
    };
    VocabHelpers.say = function (vocabKey) {
        return "{{>" + vocabKey + "}}";
    };
    VocabHelpers.param = function (paramKey) {
        return "{{params." + paramKey + "}}";
    };
    VocabHelpers.ifThen = function (paramKey, thenText) {
        return preventNesting(thenText, "{{#params." + paramKey + "}}", "{{#params." + paramKey + "}}" + thenText + "{{/params." + paramKey + "}}", thenText);
    };
    VocabHelpers.ifNot = function (paramKey, thenText) {
        return preventNesting(thenText, "{{^params." + paramKey + "}}", "{{^params." + paramKey + "}}" + thenText + "{{/params." + paramKey + "}}", thenText);
    };
    VocabHelpers.ifElse = function (paramKey, thenText, elseText) {
        return "" + VocabHelpers.ifThen(paramKey, thenText) + VocabHelpers.ifNot(paramKey, elseText);
    };
    VocabHelpers.doFirst = function (paramTextPairs, defaultText) {
        if (defaultText === void 0) { defaultText = ""; }
        // Each if/else goes inside the previous.
        // So I put my thang down, slice it and reverse it.
        // The slice creates a new array since reverse() affects the original.
        var template = paramTextPairs
            .slice()
            .reverse()
            .reduce(function (acc, curr) {
            var paramKey = curr.p;
            var value = curr.t;
            return VocabHelpers.ifElse(paramKey, value, acc);
        }, defaultText);
        return template;
    };
    return VocabHelpers;
}());
exports.VocabHelpers = VocabHelpers;
