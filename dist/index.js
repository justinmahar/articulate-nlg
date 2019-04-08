"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var weightedRandom = require("weighted-random");
/**
 * A Persona can articulate thoughts, a.k.a. sentiments, by generating speech as strings. This speech logic is defined by
 * a "core" that's provided to the Persona on construction.
 */
var Persona = /** @class */ (function () {
    /**
     * Construct a new Persona.
     *
     * @param core The core for this persona. A core contains all sentiments and the speech generated for them.
     */
    function Persona(core) {
        var _this = this;
        this.core = core;
        /**
         * Reduces the provided action to a string which is to be "said" by the persona.
         */
        this.sayAction = function (action, context) {
            var utterance = "<unknown action>";
            if (action.say) {
                utterance = action.say;
            }
            else if (action.articulate) {
                utterance = _this.articulate(action.articulate, context);
            }
            else if (action.sayContext) {
                var value = context[action.sayContext];
                utterance = value ? value : "<" + action.sayContext + ">";
            }
            if (action.capitalize) {
                utterance = lodash_1.default.capitalize(utterance);
            }
            return utterance;
        };
        /**
         * Articulates the provided sentiment, returning the utterance as a string.
         * The sentiment string represents a "thought" that is being
         * spoken by the persona, and the result returned is the generated language.
         *
         * A sentiment may be articulated in a variety of ways, so the returned string
         * is expected to vary, but will still convey the sentiment.
         *
         * A context object can be provided for personas that expect one. These can contain properties
         * to be expressed during articulation. For instance, a particular persona may expect
         * a first name property, a zodiac sign property, birth date property, etc.
         *
         * @param sentiment The sentiment to articulate, as a string.
         * @param context An optional context Object containing properties expected by a persona, such as a
         *                first name.
         *
         * @returns The string articulated by this persona for the sentiment provided. This can (and most
         *          likely will) be different every time.
         */
        this.articulate = function (sentiment, context) {
            if (context === void 0) { context = {}; }
            var utterance = "<" + sentiment + ">";
            if (_this.core.sentiments[sentiment]) {
                var arrayOrSentimentOrString = _this.core.sentiments[sentiment];
                var selectedSentimentOrString = undefined;
                // If they sentiment maps to an array of possibilities...
                if (Array.isArray(arrayOrSentimentOrString)) {
                    // We want to select a random item based on the weights.
                    var weights = arrayOrSentimentOrString.map(function (stringOrSentiment) {
                        return typeof stringOrSentiment !== "string" &&
                            stringOrSentiment.weight
                            ? stringOrSentiment.weight
                            : 1;
                    });
                    var selectedIndex = weightedRandom(weights);
                    selectedSentimentOrString = arrayOrSentimentOrString[selectedIndex];
                }
                // Otherwise it's a sentiment or a string
                else {
                    selectedSentimentOrString = arrayOrSentimentOrString;
                }
                if (selectedSentimentOrString) {
                    // If it's a string, that's sugar for a say action
                    // with that string, which is to be said.
                    if (typeof selectedSentimentOrString === "string") {
                        utterance = selectedSentimentOrString;
                    }
                    // Otherwise, it's a sentiment object! This has a
                    // "do" property that contains actions or strings to say
                    // in sequence.
                    else {
                        var actions = selectedSentimentOrString.do;
                        if (Array.isArray(actions)) {
                            utterance = actions.reduce(function (cumulative, currentAction) {
                                if (typeof currentAction === "string") {
                                    return cumulative + currentAction;
                                }
                                else {
                                    return cumulative + _this.sayAction(currentAction, context);
                                }
                            }, "");
                        }
                        else if (typeof actions === "string") {
                            utterance = actions;
                        }
                        else {
                            utterance = _this.sayAction(actions, context);
                        }
                    }
                }
            }
            return utterance;
        };
        /**
         * Articulates all sentiments, joining the generated speech using the separator provided (or a space by default).
         *
         * @param sentiments The names of all sentiments to articulate.
         * @param context Optional context for articulating.
         * @param separator Optional separator inserted between generated speech. Defaults to a space.
         * @returns The speech generated for all sentiments, joined by the separator provided or a space if none was provided.
         */
        this.articulateAll = function (sentiments, context, separator) {
            if (context === void 0) { context = {}; }
            if (separator === void 0) { separator = " "; }
            return sentiments
                .map(function (sentiment) {
                return _this.articulate(sentiment, context);
            })
                .join(separator);
        };
    }
    return Persona;
}());
exports.Persona = Persona;
