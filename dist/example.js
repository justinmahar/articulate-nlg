"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
class Dog extends index_1.default {
    constructor() {
        super(...arguments);
        this.createVocab = () => {
            // Persona helper functions, for convenience.
            const say = this.say;
            const capitalize = this.capitalize;
            const capSay = this.capSay;
            const choose = this.choose;
            const chance = this.chance;
            const cycle = this.cycle;
            const param = this.param;
            const ifElse = this.ifElse;
            // Return an object containing strings mapped to functions,
            // which return the text.
            return {
                greet: () => choose('woof', 'bark', 'sniff sniff', 'wag tail'),
                master: () => ifElse('name', capitalize(param('name')), 'bringer of food'),
                emoji: () => cycle({ group: 'emoji' }, '👅', '🐶', '🐾', '💩', '🐩', '🐕‍'),
                // This concept cross-references greet, master, and emoji using say().
                welcomeHome: () => capSay('greet') + '! Welcome home, ' + say('master') + '! ' + say('emoji'),
            };
        };
        // Create and set the vocab for Dog.
        this.vocab = this.createVocab();
    }
}
// Create "max", a new Dog persona.
const max = new Dog();
console.log(max.articulate('welcomeHome'));
// This will generate text like following:
// Sniff sniff! Welcome home, bringer of food! 🐾
// Woof! Welcome home, bringer of food! 👅
// Wag tail! Welcome home, bringer of food! 💩
// Etc.
// This will articulate the "greet" concept.
console.log(max.articulate('greet'));
// "woof", "bark", "sniff sniff", or "wag tail"
// If you reference a concept that's not understood, you'll get
// an empty string back and a warning will be printed.
console.log(max.articulate('meow'));
// ""
// Params can be used in the vocab, too. Here, the "master"
// concept uses a name if provided.
console.log(max.articulate('master', { name: 'justin' }));
// "Justin"
console.log(max.articulate('welcomeHome', { name: 'justin' }));
// Sniff sniff! Welcome home, Justin! 🐩
// And if not provided, can fall back on a default using the
// ifElse helper. See the vocab above.
console.log(max.articulate('master'));
// "bringer of food"
