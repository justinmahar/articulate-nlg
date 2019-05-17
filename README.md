[![Build Status](https://travis-ci.org/justinmahar/articulate-nlg.svg?branch=master)](https://travis-ci.org/justinmahar/articulate-nlg) [![codecov](https://codecov.io/gh/justinmahar/articulate-nlg/branch/master/graph/badge.svg)](https://codecov.io/gh/justinmahar/articulate-nlg)

# Articulate NLG

A natural language generator (NLG) that articulates concepts as words, phrases, and sentences.

This [TypeScript](https://www.typescriptlang.org/) project is [available in JavaScript via npm](https://www.npmjs.com/package/articulate-nlg) as an ES6 or CommonJS import.

## Installation

[Via npm](https://www.npmjs.com/package/articulate-nlg) (requires [Node.js](https://nodejs.org/)):

```bash
$ npm i articulate-nlg
```

## Usage

ES6 import:

```js
import Persona from "articulate-nlg";
```

CommonJS import:

```js
const Persona = require("articulate-nlg").default;
```

In short:

- Define a "Persona" that has a vocabulary which defines how to generate coherent text.
- Vocabularies use key strings that represent concepts, and function values that return the text to be generated.
- Vocab concepts can be cross-referenced, making for interesting results.

One you construct a `Persona`, call `articulate("conceptName")` on the persona to generate text for that concept!

See the example below:

```js
import Persona from "articulate-nlg";

class Dog extends Persona {
  createVocab = () => {
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
      greet: () => choose("woof", "bark", "sniff sniff", "wag tail"),
      master: () =>
        ifElse("name", capitalize(param("name")), "bringer of food"),
      emoji: () =>
        cycle({ group: "emoji" }, "👅", "🐶", "🐾", "💩", "🐩", "🐕‍"),
      // This concept cross-references greet, master, and emoji using say().
      welcomeHome: () =>
        capSay("greet") +
        "! Welcome home, " +
        say("master") +
        "! " +
        say("emoji")
    };
  };

  // Create and set the vocab for Dog.
  vocab = this.createVocab();
}

// Create "max", a new Dog persona.
let max = new Dog();

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
// ifElse helper. See the function value for master above.
console.log(max.articulate("master"));
// "bringer of food"
```

## Vocab Helper Functions

The following helper functions are available in the `Persona` class. Use these to aid in generating interesting results when defining a vocabulary.

### `say (vocabKey: string): string`

Articulates the concept with the vocab key provided. This function will generate the text for that vocab key.

### `capitalize (text: string | () => string | {t: string | () => string, w: weight}): string`

Capitalizes the first letter of the provided text.

### `sb (text: string | () => string | {t: string | () => string, w: weight}): string`

Returns the provided text with a space before it.

### `sa (text: string | () => string | {t: string | () => string, w: weight}): string`

Returns the provided text with a space after it.

### `sba (text: string | () => string | {t: string | () => string, w: weight}): string`

Returns the provided text with a space before and after it.

### `capSay (vocabKey: string): string`

Convenience function that calls `capitalize(say(vocabKey))` to both articulate a concept and then capitalize the resulting text.

### `choose (...texts: (string | () => string | {t: string | () => string, w: weight})[]): string`

Chooses one of the the provided texts or functions at random. Weights can be specified in the format `{t: text or function, w: weight}`, or by using the `weighted()` function (recommended). Weights default to `1` if not specified.

Along with `say()`, this function is at the heart of this NLG library.

#### A note on functions:

If you pass a function, the function will be called and returned as a string. Using functions can significantly speed up articulation as text resolution will be deferred until the moment the text is needed.

Using functions is overkill for lower-level concepts. I recommend using functions for higher-level concepts (which nest lots of calls to `choose()`), and that you use function shorthand.

For example, this concept is slower because each `choose()` call is resolved before making the actual choice:

```js
  myConcept: choose(
      choose(...),
      choose(...),
      ...
    )
```

And this concept is faster because the functions defer the individual `choose()` calls until after the choice is made:

```js
  myConcept: choose(
      () => choose(...),
      () => choose(...),
      ...
    )
```

### `weighted (text: string | () => string, weight: number = 1): {t: text, w: weight}`

Convenience function that returns an object with the text (or function) and weight, for use with the `choose()` and `cycle()` functions. The returned object will be in the format `{t: text or function, w: weight}`. If you pass a function, it must return a string.

Weights default to `1` if not specified.

### `chance (text: string | () => string, chance: number): string`

Return the provided text given the chance provided, from `0` to `1`, or empty string otherwise.

For instance, a chance of `0.8` would mean an 80% chance the provided text was returned, and a 20% chance of empty string.

If the value provided is a function, that function will be called and its string return value would be returned if chosen.

### `cycle (group: {group: name}, ...texts: (text: string | () => string | {t: string | () => string, w: weight})[]): string`

Uses `choose()` to randomly select one of the provided texts, but ensures that the selected item is not repeated until all remaining items have been chosen. Items can be weighted, and can be functions that return strings.

The first argument is an object containing a group name for the items you'd like to cycle: `{group: name}`

Use this function to keep a degree of randomness while ensuring the text doesn't repeat too often.

### `maybe (text: string | () => string | {t: string | () => string, w: weight}): string`

Returns the text provided 50% of the time, and empty string 50% of the time.

You can pass multiple texts. In that case, there's a 50% chance of empty string, or one of your texts being chosen using `choose()`. Texts can either be a string, weighted, or a function that returns a string.

### `param (paramKey: string): string`

Returns text for the value of the param key provided. The param value can be a string, function, number, etc.

Param functions must return a string. If the param value is not a string or function, it is concatenated with `""` and returned as a string.

### `ifThen (paramKey: string, then: (text: string | () => string)): string`

Returns the provided `then` text if the value of the param key is truthy, and returns empty string otherwise.

### `ifNot (paramKey: string, then: (text: string | () => string)): string`

Returns the provided `then` text if the value of the param key is falsy, and returns empty string otherwise.

### `ifElse (paramKey: string, then: (text: string | () => string), otherwise: (text: string | () => string)): string`

Returns the provided `then` text if the value of the param key is truthy, and returns the `otherwise` string otherwise.

### `doFirst (paramTextPairs: {p: paramKey, t: string | () => string}[], defaultText: (string | () => string) = ""): string`

Returns the text for the first param value that is truthy, or the default text if none are. `defaultText` is optional and defaults to empty string.

Use this to avoid deeply nested `ifElse()` calls.

Text values can be either strings or functions that return strings.

### `render (val: any): string`

Renders the provided value as a string.

- If it's a string, it'll be returned.
- If it's a function, it'll be called and its value will be recursively rendered and returned.
- If it's weighted text, its text property `t` will be recursively rendered and returned.
- If it's none of the above but truthy, it'll be concatenated with empty string and returned.
- If it's falsy, empty string will be returned.

This function is called on all texts for the other helper functions and is included mainly for reference. You likely won't need to call it directly.

## TypeScript Support

This is a TypeScript project. Type definitions are available in: `dist/index.d.ts`.

## ISC License

Copyright 2019 Justin Mahar

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
