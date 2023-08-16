"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persona = void 0;
const random_seed_weighted_chooser_1 = __importDefault(require("random-seed-weighted-chooser"));
const toWeightedTexts = (texts) => {
    return texts.map((val) => {
        if (typeof val === 'string' || typeof val === 'function') {
            return { t: val, w: 1 };
        }
        return val;
    });
};
class Persona {
    constructor() {
        this.articulate = (vocabKey, params = {}) => {
            return this.say(vocabKey, params);
        };
        this.say = (vocabKey, params = this.params) => {
            this.params = params;
            const val = this.vocab[vocabKey];
            if (typeof val === 'undefined') {
                console.warn('Vocab key "' + vocabKey + '" not found. Using empty string.');
            }
            return this.render(val);
        };
        this.capitalize = (text) => {
            const renderedText = this.render(text);
            return renderedText.charAt(0).toUpperCase() + renderedText.slice(1);
        };
        this.sb = (text) => {
            return ' ' + this.render(text);
        };
        this.sa = (text) => {
            return this.render(text) + ' ';
        };
        this.sba = (text) => {
            return ' ' + this.render(text) + ' ';
        };
        this.capSay = (vocabKey, params = this.params) => {
            return this.capitalize(this.say(vocabKey, params));
        };
        this.render = (val) => {
            if (typeof val === 'function') {
                // Call it and render the value, which could be anything.
                return this.render(val());
            }
            else if (typeof val === 'string') {
                return val;
            }
            else if (!!val) {
                if (!!val.t && !!val.w) {
                    // It's a weighted text.
                    return this.render(val.t);
                }
                else {
                    return val + '';
                }
            }
            else {
                return '';
            }
        };
        this.choose = (...texts) => {
            const weightedTexts = toWeightedTexts(texts);
            const choice = random_seed_weighted_chooser_1.default.chooseWeightedObject(weightedTexts, 'w');
            if (!!choice && typeof choice.t !== 'undefined') {
                return this.render(choice.t);
            }
            else {
                console.warn('Choice returned a bad value for:', texts);
                return '';
            }
        };
        this.weighted = (text, weight = 1) => {
            return { t: text, w: weight };
        };
        this.chance = (text, chance) => {
            chance = Math.min(1, Math.max(0, chance));
            const noopChance = Math.min(1, Math.max(0, 1 - chance));
            const textWeighted = { t: text, w: chance };
            const noopWeighted = { t: '', w: noopChance };
            return this.choose(noopWeighted, textWeighted);
        };
        this.cycle = (group, ...texts) => {
            const weightedTexts = toWeightedTexts(texts);
            const cycledTexts = this.getCycledTextsFor(group.group);
            let filtered = weightedTexts.filter((val) => {
                return val.w !== 0 && !cycledTexts.includes(this.render(val.t));
            });
            // If they've all been used...
            if (filtered.length === 0) {
                // Choose from any of them
                filtered = weightedTexts;
                // And remove all items from the cycled texts array
                weightedTexts.forEach((val) => {
                    const index = cycledTexts.indexOf(this.render(val.t));
                    if (index >= 0) {
                        cycledTexts.splice(index, 1);
                    }
                });
            }
            const chosen = this.choose(...filtered);
            cycledTexts.push(chosen);
            return chosen;
        };
        this.maybe = (...texts) => {
            return this.choose('', this.choose(...texts));
        };
        this.param = (paramKey) => {
            const val = this.params[paramKey];
            return this.render(val);
        };
        this.ifThen = (paramKey, then) => {
            return this.ifElse(paramKey, then, '');
        };
        this.ifNot = (paramKey, then) => {
            return this.ifElse(paramKey, '', then);
        };
        this.ifElse = (paramKey, then, otherwise) => {
            if (!!this.params[paramKey]) {
                return this.render(then);
            }
            else {
                return this.render(otherwise);
            }
        };
        this.doFirst = (paramTextPairs, defaultText = '') => {
            for (let i = 0; i < paramTextPairs.length; i++) {
                const pair = paramTextPairs[i];
                const paramKey = pair.p;
                const value = pair.t;
                if (!!this.params[paramKey]) {
                    return this.render(value);
                }
            }
            return this.render(defaultText);
        };
        this.vocab = {};
        this.params = {};
        this.cycledTextsGroups = {};
    }
    getCycledTextsFor(groupName) {
        const cycledTexts = this.cycledTextsGroups[groupName];
        if (!!cycledTexts) {
            return cycledTexts;
        }
        else {
            this.cycledTextsGroups[groupName] = [];
            return this.cycledTextsGroups[groupName];
        }
    }
}
exports.Persona = Persona;
