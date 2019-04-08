import { Persona2, ICore } from "./index";

// -- TESTS ---------------------------------------------------

let greeterCore: ICore = {
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

let justin: Persona2 = new Persona2(greeterCore);

let context = { name: "Bob" };

let sentiments = Object.keys(greeterCore.sentiments);
const TEST_COUNT = 5;
sentiments.forEach(sentiment => {
  console.log("Sentiment: ", sentiment);
  for (let i = 0; i < TEST_COUNT; i++) {
    console.log(justin.articulate(sentiment, context));
  }
});

console.log(justin.articulate("test-missing-sentiment", context));
