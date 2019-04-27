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
            var regex = /(.*)[=](\d+)/;
            segments.forEach(function (segment) {
                var match = segment.match(regex);
                if (match !== null && match.length >= 2) {
                    segmentsWithWeights.push({
                        value: match[1],
                        weight: parseInt(match[2])
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
        this.articulate = function (template, params) {
            if (params === void 0) { params = {}; }
            var coreToUse = __assign({}, _this.core, { params: __assign({}, params) });
            var vocabToUse = _this.vocab;
            var result = mustache_1.default.render(template, coreToUse, vocabToUse);
            // See if they just provided the name of a partial with no curly braces.
            // If so, wrap it in curly braces and attempt to render the partial.
            if (result === template &&
                result.indexOf("{{") < 0 &&
                result.indexOf("}}") < 0) {
                var partial = "{{>" + template + "}}";
                var resultUsingPartial = mustache_1.default.render("{{>" + template + "}}", coreToUse, vocabToUse);
                if (resultUsingPartial !== "" && resultUsingPartial !== partial) {
                    result = resultUsingPartial;
                }
            }
            return result;
        };
    }
    return Persona;
}());
exports.default = Persona;
var VocabHelpers = /** @class */ (function () {
    function VocabHelpers() {
    }
    VocabHelpers.capitalize = function (text) {
        return "{{#capitalize}}" + text + "{{/capitalize}}";
    };
    VocabHelpers.choose = function (texts) {
        var parts = texts.map(function (val) {
            if (typeof val === "string") {
                return val;
            }
            else {
                return val.v + "=" + val.w;
            }
        });
        return "{{#choose}}" + parts.join("|") + "{{/choose}}";
    };
    return VocabHelpers;
}());
exports.VocabHelpers = VocabHelpers;
