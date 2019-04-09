"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
// -- TESTS ---------------------------------------------------
var greeterCore = {
    conceptResolvers: {
        hello: [
            { do: { text: "hi there" }, weight: 1 },
            { do: { text: "heyo" }, weight: 1 },
            "yo"
        ],
        goodbye: [
            { do: { text: "goodbye" }, weight: 5 },
            { do: { text: "bye" }, weight: 5 },
            { do: { text: "cya" }, weight: 5 }
        ],
        "how-are-you": [
            { do: { text: "how are you" }, weight: 1 },
            { do: { text: "how's it going" }, weight: 1 },
            { do: { text: "how ya doing" }, weight: 1 }
        ],
        "greet-name": [
            {
                do: [
                    { articulate: "hello", capitalize: true },
                    "! ",
                    { articulate: "how-are-you", capitalize: true },
                    ", ",
                    { contextProp: "name", contextDefault: "friend" },
                    "?"
                ],
                weight: 1
            }
        ]
    }
};
var justin = new index_1.Persona(greeterCore);
var context = { name: "Bob" };
var concepts = Object.keys(greeterCore.conceptResolvers);
var TEST_COUNT = 5;
concepts.forEach(function (concept) {
    console.log("Concept name: ", concept);
    for (var i = 0; i < TEST_COUNT; i++) {
        console.log(justin.articulate(concept, context));
    }
});
console.log(justin.articulate("test-missing-concept-name", context));
console.log(justin.articulate("greet-name", {}, "Justin"));
console.log(justin.articulate("--help"));
console.log(justin.getConceptNames());
var empty = new index_1.Persona({
    conceptResolvers: {}
});
console.log(empty.articulate("--help"));
console.log("--------------");
var dogCore = {
    conceptResolvers: {
        greet: ["woof", "bark", "sniff sniff", "wag tail"],
        master: { do: { contextProp: "name", contextDefault: "bringer of food" } },
        emoji: ["👅", "🐶", "🐾", "💩", "🐩", "🐕‍"],
        "welcome-home": {
            do: [
                { articulate: "greet", capitalize: true },
                "! Welcome home, ",
                { articulate: "master" },
                "! ",
                { articulate: "emoji" }
            ]
        }
    }
};
var dogContext = { name: "Brianna" };
var max = new index_1.Persona(dogCore);
console.log(max.articulate("welcome-home", dogContext));
console.log(max.articulate("welcome-home"));
console.log(max.articulate("welcome-home", dogContext));
console.log(max.articulate("welcome-home", dogContext));
console.log(max.articulate("welcome-home", dogContext));
console.log(max.articulate("welcome-home", dogContext));
console.log(max.articulate("welcome-home", dogContext));
console.log(max.articulate("welcome-home", dogContext));
console.log(max.articulate("welcome-home", dogContext));
console.log(max.articulate("welcome-home", dogContext));
console.log(max.articulate("welcome-home", dogContext));
console.log(max.articulate("--help"));
var spanishCore = {
    conceptResolvers: { hola: ["hola", "aló", "oye"] },
    helpText: "Puedo articular los siguientes conceptos:"
};
var gabriela = new index_1.Persona(spanishCore);
console.log(gabriela.articulate("--help"));
var core = { conceptResolvers: { greet: ["hello", "hi", "hey"] } };
var brianna = new index_1.Persona(core);
var seed = 123;
console.log(brianna.articulate("greet", {}, seed));
console.log(brianna.articulate("greet", {}, seed));
console.log(brianna.articulate("greet", {}, seed));
seed = 345;
console.log(brianna.articulate("greet", {}, seed));
console.log(brianna.articulate("greet", {}, seed));
console.log(brianna.articulate("greet", {}, seed));
seed = "February";
console.log(brianna.articulate("greet", {}, seed));
console.log(brianna.articulate("greet", {}, seed));
console.log(brianna.articulate("greet", {}, seed));
// To be more explicit but keep things random, 
// you can use Math.random() as the seed, if you want.
console.log(brianna.articulate("greet", {}, Math.random())); // hello
console.log(brianna.articulate("greet", {}, Math.random())); // hey
console.log(brianna.articulate("greet", {}, Math.random())); // hey
console.log(brianna.articulate("greet", {}, Math.random())); // hi
