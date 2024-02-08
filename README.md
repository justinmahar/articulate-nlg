<h2 align="center">
  💬 Articulate NLG
</h2>
<h3 align="center">
  A natural language generator (NLG) that articulates concepts as words, phrases, and sentences.
</h3>
<p align="center">
  <a href="https://badge.fury.io/js/articulate-nlg" target="_blank" rel="noopener noreferrer"><img src="https://badge.fury.io/js/articulate-nlg.svg" alt="npm Version" /></a>&nbsp;
  <a href="https://github.com/justinmahar/articulate-nlg/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/GitHub-Source-success" alt="View project on GitHub" /></a>&nbsp;
  <a href="https://github.com/justinmahar/articulate-nlg/actions?query=workflow%3ADeploy" target="_blank" rel="noopener noreferrer"><img src="https://github.com/justinmahar/articulate-nlg/workflows/Deploy/badge.svg" alt="Deploy Status" /></a>
</p>
<!-- [lock:donate-badges] 🚫--------------------------------------- -->
<p align="center">
  <a href="https://ko-fi.com/justinmahar"><img src="https://img.shields.io/static/v1?label=Buy%20me%20a%20coffee&message=%E2%9D%A4&logo=KoFi&color=%23fe8e86" alt="Buy me a coffee" /></a>&nbsp;<a href="https://github.com/sponsors/justinmahar" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor"/></a>
</p>
<!-- [/lock:donate-badges] ---------------------------------------🚫 -->

## Documentation

Read the **[official documentation](https://justinmahar.github.io/articulate-nlg/)**.

## Overview

This package allows you to define personas that have a vocabulary which define how to generate varying, coherent text.

### Features include:

- **💬 Generate speech using defined personas**
  - Personas can articulate concepts as words, phrases, and sentences
- **👍 Simple yet flexible API**
  - Use the helpers below to build personas quickly and easily
- **🤖 Great for chatbots, game NPCs, and more!**
  - Create personas for a variety of purposes.

<!-- [lock:donate] 🚫--------------------------------------- -->

## Donate 

If this project helped you, please consider buying me a coffee or sponsoring me. Your support is much appreciated!

<a href="https://ko-fi.com/justinmahar"><img src="https://img.shields.io/static/v1?label=Buy%20me%20a%20coffee&message=%E2%9D%A4&logo=KoFi&color=%23fe8e86" alt="Buy me a coffee" /></a>&nbsp;<a href="https://github.com/sponsors/justinmahar" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor"/></a>

<!-- [/lock:donate] ---------------------------------------🚫 -->

## Table of Contents 

- [Documentation](#documentation)
- [Overview](#overview)
  - [Features include:](#features-include)
- [Donate](#donate)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Vocab Helper Functions](#vocab-helper-functions)
  - [`say`](#say)
  - [`capitalize`](#capitalize)
  - [`sb`](#sb)
  - [`sa`](#sa)
  - [`sba`](#sba)
  - [`capSay`](#capsay)
  - [`choose`](#choose)
    - [A note on functions:](#a-note-on-functions)
  - [`weighted`](#weighted)
  - [`chance`](#chance)
  - [`cycle`](#cycle)
  - [`maybe`](#maybe)
  - [`param`](#param)
  - [`ifThen`](#ifthen)
  - [`ifNot`](#ifnot)
  - [`ifElse`](#ifelse)
  - [`doFirst`](#dofirst)
  - [`render`](#render)
- [TypeScript](#typescript)
- [Icon Attribution](#icon-attribution)
- [Contributing](#contributing)
- [⭐ Found It Helpful? Star It!](#-found-it-helpful-star-it)
- [License](#license)

## Installation

```
npm i articulate-nlg
```

## Quick Start

```jsx
import { Persona } from "articulate-nlg";
```

In short:

- Define a "Persona" that has a vocabulary which defines how to generate coherent text.
- Vocabularies use key strings that represent concepts, and function values that return the text to be generated.
- Vocab concepts can be cross-referenced, making for interesting results.

One you construct a `Persona`, call `articulate("conceptName")` on the persona to generate text for that concept!

See the example below:

```js
import { Persona } from "articulate-nlg";

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

### `say`

`say (vocabKey: string): string`

Articulates the concept with the vocab key provided. This function will generate the text for that vocab key.

### `capitalize`

`capitalize (text: string | () => string | {t: string | () => string, w: weight}): string`

Capitalizes the first letter of the provided text.

### `sb`

`sb (text: string | () => string | {t: string | () => string, w: weight}): string`

Returns the provided text with a space before it.

### `sa`

`sa (text: string | () => string | {t: string | () => string, w: weight}): string`

Returns the provided text with a space after it.

### `sba`

`sba (text: string | () => string | {t: string | () => string, w: weight}): string`

Returns the provided text with a space before and after it.

### `capSay`

`capSay (vocabKey: string): string`

Convenience function that calls `capitalize(say(vocabKey))` to both articulate a concept and then capitalize the resulting text.

### `choose`

`choose (...texts: (string | () => string | {t: string | () => string, w: weight})[]): string`

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

### `weighted`

`weighted (text: string | () => string, weight: number = 1): {t: text, w: weight}`

Convenience function that returns an object with the text (or function) and weight, for use with the `choose()` and `cycle()` functions. The returned object will be in the format `{t: text or function, w: weight}`. If you pass a function, it must return a string.

Weights default to `1` if not specified.

### `chance`

`chance (text: string | () => string, chance: number): string`

Return the provided text given the chance provided, from `0` to `1`, or empty string otherwise.

For instance, a chance of `0.8` would mean an 80% chance the provided text was returned, and a 20% chance of empty string.

If the value provided is a function, that function will be called and its string return value would be returned if chosen.

### `cycle`

`cycle (group: {group: name}, ...texts: (text: string | () => string | {t: string | () => string, w: weight})[]): string`

Uses `choose()` to randomly select one of the provided texts, but ensures that the selected item is not repeated until all remaining items have been chosen. Items can be weighted, and can be functions that return strings.

The first argument is an object containing a group name for the items you'd like to cycle: `{group: name}`

Use this function to keep a degree of randomness while ensuring the text doesn't repeat too often.

### `maybe`

`maybe (text: string | () => string | {t: string | () => string, w: weight}): string`

Returns the text provided 50% of the time, and empty string 50% of the time.

You can pass multiple texts. In that case, there's a 50% chance of empty string, or one of your texts being chosen using `choose()`. Texts can either be a string, weighted, or a function that returns a string.

### `param`

`param (paramKey: string): string`

Returns text for the value of the param key provided. The param value can be a string, function, number, etc.

Param functions must return a string. If the param value is not a string or function, it is concatenated with `""` and returned as a string.

### `ifThen`

`ifThen (paramKey: string, then: (text: string | () => string)): string`

Returns the provided `then` text if the value of the param key is truthy, and returns empty string otherwise.

### `ifNot`

`ifNot (paramKey: string, then: (text: string | () => string)): string`

Returns the provided `then` text if the value of the param key is falsy, and returns empty string otherwise.

### `ifElse`

`ifElse (paramKey: string, then: (text: string | () => string), otherwise: (text: string | () => string)): string`

Returns the provided `then` text if the value of the param key is truthy, and returns the `otherwise` string otherwise.

### `doFirst`

`doFirst (paramTextPairs: {p: paramKey, t: string | () => string}[], defaultText: (string | () => string) = ""): string`

Returns the text for the first param value that is truthy, or the default text if none are. `defaultText` is optional and defaults to empty string.

Use this to avoid deeply nested `ifElse()` calls.

Text values can be either strings or functions that return strings.

### `render`

`render (val: any): string`

Renders the provided value as a string.

- If it's a string, it'll be returned.
- If it's a function, it'll be called and its value will be recursively rendered and returned.
- If it's weighted text, its text property `t` will be recursively rendered and returned.
- If it's none of the above but truthy, it'll be concatenated with empty string and returned.
- If it's falsy, empty string will be returned.

This function is called on all texts for the other helper functions and is included mainly for reference. You likely won't need to call it directly.

<!-- [lock:typescript] 🚫--------------------------------------- -->

## TypeScript

Type definitions have been included for [TypeScript](https://www.typescriptlang.org/) support.

<!-- [/lock:typescript] ---------------------------------------🚫 -->

<!-- [lock:icon] 🚫--------------------------------------- -->

## Icon Attribution

Favicon by [Twemoji](https://github.com/twitter/twemoji).

<!-- [/lock:icon] ---------------------------------------🚫 -->

<!-- [lock:contributing] 🚫--------------------------------------- -->

## Contributing

Open source software is awesome and so are you. 😎

Feel free to submit a pull request for bugs or additions, and make sure to update tests as appropriate. If you find a mistake in the docs, send a PR! Even the smallest changes help.

For major changes, open an issue first to discuss what you'd like to change.

<!-- [/lock:contributing] --------------------------------------🚫 -->

## ⭐ Found It Helpful? [Star It!](https://github.com/justinmahar/articulate-nlg/stargazers)

If you found this project helpful, let the community know by giving it a [star](https://github.com/justinmahar/articulate-nlg/stargazers): [👉⭐](https://github.com/justinmahar/articulate-nlg/stargazers)

## License

See [LICENSE.md](https://justinmahar.github.io/articulate-nlg/?path=/story/license--page).