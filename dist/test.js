"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
// -- TESTS ---------------------------------------------------
var greeterCore = {
    sentiments: {
        hello: [
            { do: { say: "hi there" }, weight: 1 },
            { do: { say: "heyo" }, weight: 1 },
            "yo"
        ],
        goodbye: [
            { do: { say: "goodbye" }, weight: 1 },
            { do: { say: "bye" }, weight: 1 },
            { do: { say: "cya" }, weight: 1 }
        ],
        "how-are-you": [
            { do: { say: "how are you" }, weight: 1 },
            { do: { say: "how's it going" }, weight: 1 },
            { do: { say: "how ya doing" }, weight: 1 }
        ],
        "greet-name": [
            {
                do: [
                    { articulate: "hello", capitalize: true },
                    "! ",
                    { articulate: "how-are-you", capitalize: true },
                    ", ",
                    { sayContext: "name" },
                    "?"
                ],
                weight: 1
            }
        ]
    }
};
var justin = new index_1.Persona2(greeterCore);
var context = { name: "Bob" };
var sentiments = Object.keys(greeterCore.sentiments);
var TEST_COUNT = 5;
sentiments.forEach(function (sentiment) {
    console.log("Sentiment: ", sentiment);
    for (var i = 0; i < TEST_COUNT; i++) {
        console.log(justin.articulate(sentiment, context));
    }
});
console.log(justin.articulate("test-missing-sentiment", context));
