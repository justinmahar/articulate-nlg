import { Persona, ICore } from "./index";

// -- TESTS ---------------------------------------------------

let greeterCore: ICore = {
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

let justin: Persona = new Persona(greeterCore);

let context = { name: "Bob" };

let concepts = Object.keys(greeterCore.conceptResolvers);
const TEST_COUNT = 5;
concepts.forEach(concept => {
  console.log("Concept name: ", concept);
  for (let i = 0; i < TEST_COUNT; i++) {
    console.log(justin.articulate(concept, context));
  }
});

console.log(justin.articulate("test-missing-concept-name", context));
console.log(justin.articulate("greet-name", {}, "Justin"));
console.log(justin.articulate("--help"));
console.log(justin.getConceptNames());

let empty: Persona = new Persona({
  conceptResolvers: {}
});
console.log(empty.articulate("--help"));
