"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var seedrandom = require("seedrandom");
/**
 * A Persona can articulate concepts by generating speech as strings containing text. This speech logic is defined by
 * a "core" that's provided to the Persona on construction.
 */
var Persona = /** @class */ (function () {
    /**
     * Construct a new Persona using the provided core.
     *
     * @param core The core for this persona. A core contains all concepts and the resolvers that generate text for them.
     */
    function Persona(core) {
        var _this = this;
        this.core = core;
        /**
         * Generates text using the generator provided. Don't call this directly on a persona.
         *
         * @param generator The generator to create text from.
         * @param context Optional context object used by the generator to pull text from.
         */
        this.generateTextForGenerator = function (generator, context, seed) {
            if (context === void 0) { context = {}; }
            if (seed === void 0) { seed = Math.random(); }
            var text = "<unknown generator>";
            if (generator.text) {
                text = generator.text;
            }
            else if (generator.articulate) {
                text = _this.articulate(generator.articulate, context, seed);
            }
            else if (generator.contextProp) {
                var value = context[generator.contextProp];
                value = value ? value : generator.contextDefault;
                text = value ? value : "<" + generator.contextProp + ">";
            }
            if (generator.capitalize) {
                text = lodash_1.default.capitalize(text);
            }
            return text;
        };
        /**
         * Articulates the provided concept, returning the generated speech as a string containing text. Providing `--help` articulates
         * all concept names this persona can articulate. You can call `articulateHelp()` directly as well.
         *
         * The concept string represents a "thought" that is being
         * articulated by the persona, and the resulting string returned is the generated text that represents the concept.
         *
         * A concept may be articulated in a variety of ways, so the returned string
         * is expected to vary, but will still convey the concept in one way or another.
         *
         * A context object can be provided for personas that expect one. These can contain properties
         * to be expressed during articulation. For instance, a particular persona may expect
         * a firstName property, a zodiacSign property, birthDate property, etc. In cases where
         * such an expectation exists, check the core's documentation.
         *
         * @param conceptName The name of the concept to articulate as a string.
         * @param context An optional context Object containing properties expected by a persona, such as firstName.
         *
         * @returns The speech text articulated by this persona for the concept provided. This can (and most
         *          likely will) be different every time for a particular concept.
         */
        this.articulate = function (conceptName, context, seed) {
            if (context === void 0) { context = {}; }
            if (seed === void 0) { seed = Math.random(); }
            var text = "<" + conceptName + ">";
            if (_this.core.conceptResolvers[conceptName]) {
                var arrayOrResolverOrString = _this.core.conceptResolvers[conceptName];
                var selectedResolverOrString = undefined;
                // If the concept maps to an array of possibilities...
                if (Array.isArray(arrayOrResolverOrString)) {
                    // We want to select a random item based on the weights.
                    var weights = arrayOrResolverOrString.map(function (stringOrResolver) {
                        return typeof stringOrResolver !== "string" && stringOrResolver.weight
                            ? stringOrResolver.weight
                            : 1;
                    });
                    var selectedIndex = weightedRandom(weights, seed);
                    selectedResolverOrString = arrayOrResolverOrString[selectedIndex];
                }
                // Otherwise it's a resolver or a string!
                else {
                    selectedResolverOrString = arrayOrResolverOrString;
                }
                if (selectedResolverOrString) {
                    // If it's a string, that's a shortcut for text generation
                    // using that string.
                    if (typeof selectedResolverOrString === "string") {
                        text = selectedResolverOrString;
                    }
                    // Otherwise, it's a resolver! This has a `do` property that contains generators
                    // or text to be concatenated together. We're almost there...
                    else {
                        var textOrArrayOfGenerators = selectedResolverOrString.do;
                        // If it's an array, concatenate all the generated text together.
                        if (Array.isArray(textOrArrayOfGenerators)) {
                            text = textOrArrayOfGenerators.reduce(function (cumulative, currentItem) {
                                if (typeof currentItem === "string") {
                                    return cumulative + currentItem;
                                }
                                else {
                                    return (cumulative +
                                        _this.generateTextForGenerator(currentItem, context, seed));
                                }
                            }, "");
                        }
                        // If it's a string, use this as the generated text.
                        else if (typeof textOrArrayOfGenerators === "string") {
                            text = textOrArrayOfGenerators;
                        }
                        // Otherwise, use the generator to generate the text.
                        else {
                            text = _this.generateTextForGenerator(textOrArrayOfGenerators, context, seed);
                        }
                    }
                }
            }
            else if (conceptName === "--help") {
                text = _this.articulateHelp();
            }
            return text;
        };
        /**
         * Articulates the names of the concepts this persona can articulate.
         */
        this.articulateHelp = function () {
            var keys = Object.keys(_this.core.conceptResolvers);
            var text = _this.core.helpText
                ? "🤷"
                : "My core is empty! I can't articulate any concepts. 🤷";
            if (keys.length > 0) {
                text =
                    (_this.core.helpText
                        ? _this.core.helpText
                        : "I can articulate the following concepts:") +
                        "\n" +
                        keys.map(function (key) { return "- " + key; }).join("\n");
            }
            return text;
        };
        /**
         * Returns the names of all concepts this persona can articulate.
         *
         * @return A string array containing the names of all concepts this persona can articulate.
         */
        this.getConceptNames = function () { return Object.keys(_this.core.conceptResolvers); };
        /**
         * Returns the persona's core. Handle with care :)
         */
        this.getCore = function () { return _this.core; };
        /**
         * Sets the persona's core.
         * @param core The new core.
         */
        this.setCore = function (core) {
            _this.core = core;
        };
    }
    return Persona;
}());
exports.default = Persona;
function weightedRandom(weights, seed) {
    if (seed === void 0) { seed = Math.random(); }
    var cumulative = 0;
    var ranges = weights.map(function (weight) { return (cumulative += weight); });
    var seededRand = new seedrandom(seed);
    var selectedValue = seededRand() * cumulative;
    for (var index = 0; index < ranges.length; index++) {
        if (selectedValue <= ranges[index]) {
            return index;
        }
    }
    return -1;
}
