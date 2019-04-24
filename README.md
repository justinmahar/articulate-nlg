# Articulate NLG

A natural language generator (NLG) that articulates concepts as words, phrases, and sentences.

This [TypeScript](https://www.typescriptlang.org/) project is [available in JavaScript via npm](https://www.npmjs.com/package/articulate-nlg) as a CommonJS import.

## Installation

[Via npm](https://www.npmjs.com/package/articulate-nlg) (requires [Node.js](https://nodejs.org/)):

```bash
$ npm i articulate-nlg
```

CommonJS import:

```js
const Persona = require("articulate-nlg").default;
```

## Usage

Vocabularies for a persona are defined as key value pairs. The underlying templating engine is [mustache.js](https://github.com/janl/mustache.js/), and uses partials.

There are a few function wrappers defined:

- `capitalize`: Capitalizes the contents after rendering it.
- `choose`: Chooses one of the items at random.
  - Items are separated by `|` pipes.
  - Each item is rendered, meaning you can next additional partials (`{{> partialName }}`).
  - You can specify weights using `=weight` where weight is the value.
    - For example, `greet: "{{#choose}}woof=5|bark=95{{/choose}}"` would mean a 5% chance of `"woof"` and a 95% chance of `"bark"`.

Call `articulate(template, params)` on the persona to generate text!

See the example below.

```js
const Persona = require("articulate-nlg").default;

let max:any = null;

let dogVocab = {
  greet: "{{#choose}}woof|bark|sniff sniff|wag tail{{/choose}}",
  master:
  "{{#params.name}}{{#capitalize}}{{params.name}}{{/capitalize}}{{/params.name}}{{^params.name}}bringer of food{{/params.name}}",
  emoji: "{{#choose}}👅|🐶|🐾|💩|🐩|🐕‍{{/choose}}",
  "welcome-home":
  "{{#capitalize}}{{>greet}}{{/capitalize}}! Welcome home, {{>master}}! {{>emoji}}"
};

max = new Persona(dogVocab);

max.articulate("welcome-home");
// Sniff sniff! Welcome home, bringer of food! 🐾
// Woof! Welcome home, bringer of food! 👅
// Wag tail! Welcome home, bringer of food! 🐕‍
// Etc.

max.articulate("greet");
// "woof", "bark", "sniff sniff", "wag tail"

max.articulate("{{>greet}}");
// "woof", "bark", "sniff sniff", "wag tail"

max.articulate("master", { "name": "justin" });
// "Justin"

max.articulate("{{>master}}", { "name": "justin" });
// "Justin"

max.articulate("{{#capitalize}}{{>master}}{{/capitalize}}");
// "Bringer of food"

max.articulate("missing");
// "missing"
```

## TypeScript Support

This is a TypeScript project, so type definitions are available in: `dist/index.d.ts`. These help a lot when building cores, but feel free to use vanilla JS if you want.

## ISC License

Copyright 2019 Justin Mahar

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
