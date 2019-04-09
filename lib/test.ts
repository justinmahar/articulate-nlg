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

console.log("--------------");
let dogCore = {
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
let dogContext = { name: "Brianna" };

let max = new Persona(dogCore);
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


let spanishCore = {
  conceptResolvers: { hola: ["hola", "aló", "oye"] },
  helpText: "Puedo articular los siguientes conceptos:"
};
let gabriela = new Persona(spanishCore);
console.log(gabriela.articulate("--help"));

let core = { conceptResolvers: { greet: ["hello", "hi", "hey"] } };
let brianna = new Persona(core);

let seed:any = 123;
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
