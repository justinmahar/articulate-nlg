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
var index_1 = __importDefault(require("./index"));
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.createVocab = function () {
            // Persona helper functions, for convenience.
            var say = _this.say;
            var capitalize = _this.capitalize;
            var capSay = _this.capSay;
            var choose = _this.choose;
            var chance = _this.chance;
            var cycle = _this.cycle;
            var param = _this.param;
            var ifElse = _this.ifElse;
            // Return an object containing strings mapped to functions,
            // which return the text.
            return {
                greet: function () { return choose("woof", "bark", "sniff sniff", "wag tail"); },
                master: function () {
                    return ifElse("name", capitalize(param("name")), "bringer of food");
                },
                emoji: function () {
                    return cycle({ group: "emoji" }, "👅", "🐶", "🐾", "💩", "🐩", "🐕‍");
                },
                // This concept cross-references greet, master, and emoji using say().
                welcomeHome: function () {
                    return capSay("greet") +
                        "! Welcome home, " +
                        say("master") +
                        "! " +
                        say("emoji");
                }
            };
        };
        // Create and set the vocab for Dog.
        _this.vocab = _this.createVocab();
        return _this;
    }
    return Dog;
}(index_1.default));
// Create "max", a new Dog persona.
var max = new Dog();
console.log(max.articulate("welcomeHome"));
// This will generate text like following:
// Sniff sniff! Welcome home, bringer of food! 🐾
// Woof! Welcome home, bringer of food! 👅
// Wag tail! Welcome home, bringer of food! 💩
// Etc.
// This will articulate the "greet" concept.
console.log(max.articulate("greet"));
// "woof", "bark", "sniff sniff", or "wag tail"
// If you reference a concept that's not understood, you'll get
// an empty string back and a warning will be printed.
console.log(max.articulate("meow"));
// ""
// Params can be used in the vocab, too. Here, the "master"
// concept uses a name if provided.
console.log(max.articulate("master", { name: "justin" }));
// "Justin"
console.log(max.articulate("welcomeHome", { name: "justin" }));
// Sniff sniff! Welcome home, Justin! 🐩
// And if not provided, can fall back on a default using the
// ifElse helper. See the vocab above.
console.log(max.articulate("master"));
// "bringer of food"
