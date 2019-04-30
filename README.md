[![Build Status](https://travis-ci.org/justinmahar/articulate-nlg.svg?branch=master)](https://travis-ci.org/justinmahar/articulate-nlg) [![codecov](https://codecov.io/gh/justinmahar/articulate-nlg/branch/master/graph/badge.svg)](https://codecov.io/gh/justinmahar/articulate-nlg)

# Articulate NLG

A natural language generator (NLG) that articulates concepts as words, phrases, and sentences.

This [TypeScript](https://www.typescriptlang.org/) project is [available in JavaScript via npm](https://www.npmjs.com/package/articulate-nlg) as an ES6 or CommonJS import.

## Installation

[Via npm](https://www.npmjs.com/package/articulate-nlg) (requires [Node.js](https://nodejs.org/)):

```bash
$ npm i articulate-nlg
```

ES6 import:

```js
import Persona, { VocabHelpers } from "articulate-nlg";
```

CommonJS import:

```js
const Persona = require("articulate-nlg").default;
const VocabHelpers = require("articulate-nlg").VocabHelpers;
```

## Usage

In short:

- Define "personas" that have vocabularies which can randomly generate coherent text.
- Vocabularies use key strings that represent concepts, and values that represent the text to be generated.
- Concepts can be cross-referenced, making for interesting and sometimes unexpected results.

A persona requires a vocabulary, which defines the text that can be generated. Vocabularies for a persona are defined as key value string pairs in a JS object.

The underlying templating engine is [mustache.js](https://github.com/janl/mustache.js/), and all key values are actually Mustache partials. However, this library provides helper functions so you most likely won't need to write any mustache.js syntax! You can still use it if you'd like, though, but do so at your own peril.

Vocab concepts can be cross-referenced. Just make sure you avoid circular references, which will cause an infinite loop.

One you construct a `Persona`, call `say("conceptName")` on the persona to generate text for that concept!

See the example below:

```js
import Persona, { VocabHelpers } from "articulate-nlg";
const choose = VocabHelpers.choose;
const capitalize = VocabHelpers.capitalize;
const say = VocabHelpers.say;
const param = VocabHelpers.param;
const ifElse = VocabHelpers.ifElse;

// Here we have the greet, master, emoji, and welcomeHome concepts.
// Each concept maps to the text that's to be generated.
// Helper functions generate the templating syntax for you automatically.
let dogVocab = {
  greet: choose(["woof", "bark", "sniff sniff", "wag tail"]),
  master: ifElse("name", capitalize(param("name")), "bringer of food"),
  emoji: choose("👅", "🐶", "🐾", "💩", "🐩", "🐕‍"]),
  // This concept cross-references greet, master, and emoji using say().
  welcomeHome: capitalize(say("greet")) + "! Welcome home, " + 
               say("master") + "! " + say("emoji")
};

let max = new Persona(dogVocab);

max.say("welcomeHome");
// This will generate text like following:
// Sniff sniff! Welcome home, bringer of food! 🐾
// Woof! Welcome home, bringer of food! 👅
// Wag tail! Welcome home, bringer of food! 💩
// Etc.

// This will articulate the "greet" concept.
max.say("greet");
// "woof", "bark", "sniff sniff", or "wag tail"

// If you reference a concept that's not understood, you'll get
// an empty string back.
max.say("wubalubadubdub");
// ""

// Params can be used in the vocab, too. Here, the "master" 
// concept uses a name if provided.
max.say("master", { name: "justin" });
// "Justin"
max.say("welcomeHome", { name: "justin" });
// Sniff sniff! Welcome home, Justin! 🐩

// And if not provided, can fall back on a default using the 
// ifElse helper. See the vocab above.
max.say("master");
// "Bringer of food"
```

## Vocab Helper Functions

The vocab helper functions abstract away the templating syntax for the underlying templating engine. These can (and should!) be used instead of mustache.js syntax whenever possible.

See the [mustache.js](https://github.com/janl/mustache.js/) documentation for reference on the syntax if you *must* (heh heh). If there's something really fancy you want to do that this library doesn't have a helper for, go for it.

**Where possible, it is recommended that you use helper functions over mustache.js syntax to define your persona.**

The following helper functions are available in `VocabHelpers`:

- `capitalize(text: string)` - Creates a template for capitalization. Capitalizes the first letter of the contents after articulating it.
- `choose(texts: (string|{v:value,w:weight})[])` - Creates a template for random choice. This chooses one of the items at random. Takes a mixed array of strings or weighted objects in the format `{v: value, w: weight}`. You cannot use a `|` character in any of the texts. If you need this character, use `say("pipe")` and have the `"pipe"` key map to `"|"`.
  - Each item is articulated, meaning you can `say()` vocab keys.
    - `choose(["apple", "orange", say("meat")])` -> Randomly selects `apple`, `orange`, or whatever `meat` articulates as.
  - You can specify weights using `{v: value, w: weight}` objects instead of strings, where `v` is the text to articulate and `w` is the weight value. Weights default to `1` if not provided.
    - `choose([{v: "apple" w: 3}, "orange", "banana"])` -> `apple` has an 80% chance, `orange` and `banana` have a 20% chance (default weight of `1`).
- `maybe(text: string)` - Creates a template that results in a 50/50 choice between an empty string or the provided text. You cannot use a `|` character in the text. If you need this character, use `say("pipe")` and have the `"pipe"` key map to `"|"`.
- `say(vocabKey: string)` - Creates a template that articulates another vocab key.
- `param(paramKey: string)` - Creates a template that references the value of a parameter.
- `ifThen(paramKey: string, thenText: string)` - Creates a template that uses the provided `thenText` if the param key exists and is not falsy.
- `ifNot(paramKey: string, thenText: string)` - Creates a template that uses the provided `thenText` if the param key doesn't exist or is falsy.
- `ifElse(paramKey: string, thenText: string, elseText: string)` - Creates a template with both `ifThen()` and `ifNot()` templates for the given param key.
- `doFirst(paramTextPairs: {p: paramKey, t: text}[], defaultText: string = "")` - Creates a template that uses `ifElse()` templates for each pair provided until true. If no param keys are truthy, the `defaultText` is used (defaults to empty string).

You cannot nest the same function wrapper in itself. If, say, you need to nest `choose()` within `choose()`, you should create a separate vocab key with the function and reference it in the original one like so: `say("nameOfVocabKey")`. A safety check is built into these functions to prevent nesting and a warning will be printed to the console if you do nest them on accident.

## TypeScript Support

This is a TypeScript project. Type definitions are available in: `dist/index.d.ts`.

## ISC License

Copyright 2019 Justin Mahar

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
