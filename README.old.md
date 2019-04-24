# Articulate NLG

A natural language generator (NLG) that articulates concepts as words, phrases, and sentences.

This [TypeScript](https://www.typescriptlang.org/) project is [available in JavaScript via npm](https://www.npmjs.com/package/articulate-nlg) as a CommonJS import.

## Table Of Contents

- [Articulate NLG](#articulate-nlg)
  - [Table Of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Quick Start](#quick-start)
  - [Ready-To-Use Personas Via npm](#ready-to-use-personas-via-npm)
  - [Contributing](#contributing)
    - [Developing On This Project:](#developing-on-this-project)
    - [Sharing Your Personas:](#sharing-your-personas)
  - [Tutorial](#tutorial)
    - [Overview](#overview)
    - [Personas and Cores](#personas-and-cores)
    - [Resolvers](#resolvers)
      - [`do`](#do)
      - [`weight`](#weight)
    - [Generators](#generators)
      - [Text Generators](#text-generators)
      - [Articulate Generators](#articulate-generators)
      - [Context Generators](#context-generators)
      - [Multiple `do` Items For Resolvers](#multiple-do-items-for-resolvers)
    - [Seeding The Pseudorandom Number Generator (PRNG)](#seeding-the-pseudorandom-number-generator-prng)
    - [Built-in Help Text For Concept Names](#built-in-help-text-for-concept-names)
    - [Miscellaneous](#miscellaneous)
  - [TypeScript Support](#typescript-support)
  - [ISC License](#isc-license)

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

You can either use a [ready-to-use persona](#ready-to-use-personas-via-npm) that can articulate concepts, or create your own.

To get started creating your own persona, use the Quick Start core below. It uses most of the features you'll likely need to get moving! 

If you're the kind of person who likes to get their hands dirty, this lets you dive in right away.

After you run the Quick Start, I suggest you read the short [tutorial](#tutorial) below to learn how everything works.

### Quick Start

In a terminal, create a new directory, install Articulate NLG, and open a new JS file in your editor of choice (I recommend [VS Code](https://code.visualstudio.com/)):

```bash
$ md cnlg-starter
$ cd cnlg-starter
$ npm i articulate-nlg  # Installs Articulate NLG as a node module. Requires Node.js.
$ code main.js          # Opens main.js in VS code; use any editor
```

Paste and save the following:

```js
const Persona = require("articulate-nlg").default;

let dogCore = {
  conceptResolvers: {
    greet: ["woof", "bark", "sniff sniff", "wag tail"],
    master: ["master", "best friend", "my favorite human"],
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

let max = new Persona(dogCore);
console.log(max.articulate("welcome-home"));
```

Run it!

```bash
$ node main.js
Woof! Welcome home, my favorite human! 🐩
```

## Ready-To-Use Personas Via npm

The following are personas that you can use immediately via npm.

- TBD (this project is brand new and I'm still creating them!)

## Contributing

Contributions are encouraged! We'd love to see what you create.

### Developing On This Project:

- If you catch a bug, would like to request a feature, or would like to start a discussion, [add an issue to the GitHub project](https://github.com/justinmahar/articulate-nlg/issues).
- If you think you can fix it or implement it, [fork the project](https://github.com/justinmahar/articulate-nlg/fork) and then send me a pull request when you're done. :)

### Sharing Your Personas:

If you decide to create a persona, share it with others via npm!

Here's how to go about it:

- Make a project on GitHub with a `package.json` containing your `articulate-nlg` version dependency. I recommend [TypeScript](https://www.typescriptlang.org/) but plain JavaScript is welcome too!
- Create an npm module. For your npm module, use CommonJS module format.
  - **Your default export should be a persona instance that contains your core.**
    - This ensures your persona always works for everyone even if the articulate-nlg project's specs change over time.
    - This also allows people to import your persona and use it right away.
  - Be sure to test importing and using your persona!
- If you'd like to share a persona you've made in the [Ready-To-Use Personas](#ready-to-use-personas-via-npm) section of this README, [add it to this README](https://github.com/justinmahar/articulate-nlg/fork) and send me a pull request. That section is only for personas than can be used via npm out of the box.

---

## Tutorial

Read this tutorial if:

- You want a better understanding of how Articulate NLG works.
- You want to create your own persona to generate speech text with.
- You're curious and just want to know more.

Go ahead, read on. You know you want to!

### Overview

> articulate | är-ˈti-kyə-ˌlāt
>
>   to give clear and effective utterance to : to put into words

With Articulate NLG, you can define personas that can articulate concepts (represented as strings) as speech text. Articulation is putting those concepts into words.

- For instance, a particular persona might articulate the concept `"greet"` as `"hello"`, `"hi"`, or `"hey"`.
- Another persona might articulate that same concept as `"oy!"`, `"yo!"`, or `"sup!"`.
- When a persona articulates a concept, they can string together pieces of text and can even articulate other concepts inline to build meaningful phrases and sentences!

The generated text for a concept is typically random and, as mentioned, can even reference other concepts. This allows you to define hundreds or even thousands of permutations of speech elegantly.

Articulate NLG also allows you to vary the randomness so you can bend speech patterns to your liking. You can make certain text more or less likely to generate, or you can use your own pseudorandom number generator (PRNG) seed for ultimate control.

To personalize the generated text, you can also define a "context" object that your persona can reference, like a mail merge. 

Let's go deeper!

### Personas and Cores

A persona is powered by a core, which contains all the concept definitions and text that will be generated.

Think of the core as the brain for a persona. It has all of their possible ideas ("concepts") and how they'd articulate them as speech ("resolvers").

When you want to generate speech for a concept, you call `articulate(conceptName)` on the persona.

For example:

```js
let core = { conceptResolvers: { greet: ["hello", "hi", "hey"] } };
let brianna = new Persona(core);

console.log(brianna.articulate("greet")); // hello, hi, or hey
```

So, how does Brianna know which greeting to say? Well, the core contains concept names (such as "greet") which are mapped to resolvers, such as "hello", "hi", and "hey".

If more than one resolver is specified, one of them is randomly chosen.

And finally, if there's no such concept called `"greet"`, then it will just create the text `<greet>`.

But things can get more advanced than that! Keep reading...

### Resolvers

Resolvers can be more complicated than just providing strings. In fact, providing a string (as shown above with "hello", "hi", or "hey") is actually shorthand for creating a resolver, like so:

```js
{ do: { text: "hello" }, weight: 1 }
```

So if you expand the example above out, it could look like this (and would produce the same results!):

```js
let core = {
  conceptResolvers: {
    greet: [
      { do: { text: "hello" }, weight: 1 },
      { do: { text: "hi" }, weight: 1 },
      { do: { text: "hey" }, weight: 1 }
    ]
  }
};
let brianna = new Persona(core);

console.log(brianna.articulate("greet")); // hello, hi, or hey
```

What's going on here?

Well, `greet` is being mapped to a list of objects, and each one of those is what's called a **resolver**. When articulating, the persona picks one of these resolvers to resolve the concept as speech text.

#### `do`

Each resolver has two properties: The first is `do`, which specifies either a single generator (which creates text, more on that in a second), a list of generators/text, or just some text. 

The way `do` works is it collects text from all generators and simply concatenates them together in the order they appear. Using `do` and lists of generators (or text), you can form phrases and sentences. 

If this seems confusing, we'll clear it up later with some examples!

#### `weight`

The second resolver property is `weight`, which defaults to `1`. The weight determines how likely it is for the persona to use a particular resolver when articulating speech.

In the example above, all text has an equal chance of being picked.

Let's change the weight values a bit:

```js
let core = {
  conceptResolvers: {
    greet: [
      { do: { text: "hello" }, weight: 5 },
      { do: { text: "hi" }, weight: 94 },
      { do: { text: "hey" }, weight: 1 }
    ]
  }
};
let brianna = new Persona(core);

console.log(brianna.articulate("greet"));
// 5% chance of "hello"
// 94% chance of "hi"
// 1% chance of "hey"
```

If we shift the weights around a bit, we can make certain resolvers more or less likely to be chosen.

So to summarize so far:

- A persona has a core, which acts as the brain.
- That core has concepts that map to resolvers, which are picked randomly each time a persona articulates a particular concept.
- The randomness of resolver selection can be tweaked by applying a different `weight` to each resolver.
- Resolvers generate text by specifying text or generators to `do`.

With me so far? :) Great, let's continue.

### Generators

Once chosen, a resolver's job is to generate text. To do this, it uses generators.

There are a few kinds of generators, one of which we've already seen. Let's go through each one below!

#### Text Generators

We've already seen a text generator, so nothing new here.

A text generator will simply generate the text you specify in the `text` property:

```js
let generator = {
  text: "Well hi there. Welcome home!"
};
```

#### Articulate Generators

This is where things get fun! Instead of specifying text, you can reference another concept that exists in the core.

```js
let generator = {
  articulate: "greet"
};
```

This generator would articulate the concept `"greet"` and produce the text for the resolver chosen.

Optionally, you can also capitalize it by providing `capitalize: true`:

```js
let generator = {
  articulate: "greet",
  capitalize: true
};
```

This would capitalize the first letter of the text generated by articulating the "greet" concept.

For example, let's say we have the following core for a dog:

```js
let dogCore = {
  conceptResolvers: {
    greet: ["woof", "bark", "sniff sniff", "wag tail"],
    master: ["master", "best friend", "my favorite human"],
    emoji: ["👅", "🐶", "🐾", "💩", "🐩", "🐕‍"]
  }
};
```

With this core we can generate cute dog greetings, have a name for a dog's master, and can make dog emojis. The strings have an equal chance of being picked when articulating the concepts.

But let's go one step further and combine them to create the `"welcome-home"` concept...

```js
let dogCore = {
  conceptResolvers: {
    greet: ["woof", "bark", "sniff sniff", "wag tail"],
    master: ["master", "best friend", "my favorite human"],
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

let max = new Persona(dogCore);
console.log(max.articulate("welcome-home"));
```

Calling `max.articulate("welcome-home")` generates speech such as:

```bash
Bark! Welcome home, best friend! 🐾
Wag tail! Welcome home, my favorite human! 🐩
Sniff sniff! Welcome home, best friend! 🐶
Wag tail! Welcome home, master! 🐕‍
Sniff sniff! Welcome home, master! 💩
Woof! Welcome home, my favorite human! 🐩
```

Now we're talking! _Slaps knee_.

Just a few concept definitions later and we have a best friend to welcome us home in many different ways, sometimes with poop.

#### Context Generators

In the real world, we operate on the context of any given situation. For instance, if we know someone's name, we might use it in a sentence while articulating a thought.

Context generators allow us to do just that. You can reference information about a particular situation and weave it into your generated text, like a mail merge.

```js
let generator = {
  contextProp: "name"
};
```

You can also specify a `contextDefault` in case it's not found...

```js
let generator = {
  contextProp: "name",
  contextDefault: "bringer of food"
};
```

To use your context generator, you pass a `context` parameter into `articulate()` that contains the property whose value you want to use.

Like so:

```js
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

let max = new Persona(dogCore);

let context = { name: "Brianna" };

console.log(max.articulate("welcome-home", context));
// Bark! Welcome home, Brianna! 🐶

// Because we specified a contextDefault, if we leave the context out, this is what we get:
console.log(max.articulate("welcome-home"));
// Woof! Welcome home, bringer of food! 👅
```

If you don't specify a `contextDefault` and it's not found, it will generate text containing the property name in angle brackets, like so: `<name>`.

#### Multiple `do` Items For Resolvers

When specifying a resolver's `do`, you can either specify a string, a generator, or you can specify a list of generators/strings.

We've already seen an example above, for the dog's `"welcome-home"` resolver.

Again, the way `do` works is it takes text from all generators and simply concatenates them together. Using `do` and lists of generators or text, you can form phrases and sentences.

### Seeding The Pseudorandom Number Generator (PRNG)

If you'd like more control over the randomized resolver selection process, you can specify a seed for the pseurdorandom number generator used under the hood.

A seed can be any value. Specifying a seed will cause the text generated to be to same every time for a given seed.

When you want to generate something different, just change the seed.

For instance:

```js
let core = { conceptResolvers: { greet: ["hello", "hi", "hey"] } };
let brianna = new Persona(core);

// Until the seed changes, the result will always be the same.
let seed = 123;
console.log(brianna.articulate("greet", {}, seed)); // hello
console.log(brianna.articulate("greet", {}, seed)); // hello
console.log(brianna.articulate("greet", {}, seed)); // hello
seed = 345;
console.log(brianna.articulate("greet", {}, seed)); // hi
console.log(brianna.articulate("greet", {}, seed)); // hi
console.log(brianna.articulate("greet", {}, seed)); // hi
seed = "February";
console.log(brianna.articulate("greet", {}, seed)); // hey
console.log(brianna.articulate("greet", {}, seed)); // hey
console.log(brianna.articulate("greet", {}, seed)); // hey

// To be more explicit but still keep things random,
// you can use Math.random() as the seed, if you want.
console.log(brianna.articulate("greet", {}, Math.random())); // hello
console.log(brianna.articulate("greet", {}, Math.random())); // hey
console.log(brianna.articulate("greet", {}, Math.random())); // hey
console.log(brianna.articulate("greet", {}, Math.random())); // hi
console.log(brianna.articulate("greet", {}, Math.random())); // hello
```

Seed examples/ideas:

- Name-based - Use someone's name as the seed to keep a consistent message for that person.
- Time-based - Use the date as the seed to have a different message each day.
- Variety Cap - Generate different speech until a limit is reached, then keep it the same, or vice versa.
- Combinations - Combine names and times to create unique messages that change at your desired pace (once per hour, day, etc).

### Built-in Help Text For Concept Names

You can call `articulate("--help")` or `articulateHelp()` to generate some helpful text containing all concept names.

```js
console.log(max.articulate("--help"));
// OR
console.log(max.articulateHelp());
```

```bash
I can articulate the following concepts:
- greet
- master
- emoji
- welcome-home
```

If your core is written in another language, you can override the default help message by specifing `helpText` in the core:

```js
let spanishCore = {
  conceptResolvers: { hola: ["hola", "aló", "oye"] },
  helpText: "Puedo articular los siguientes conceptos:"
};
let gabriela = new Persona(spanishCore);
console.log(gabriela.articulate("--help"));
```

```bash
Puedo articular los siguientes conceptos:
- hola
```

Of course, for your own needs, you can always write your own help text as a separate concept.

### Miscellaneous

For your convenience/flexibility:

- You can get a list of all concept names using `persona.getConceptNames()`. They are pulled directly from the core using `Object.keys()`.
- For some neuralyzer level voodoo, you can get/set the whole core on a persona using `persona.getCore()` and `persona.setCore(core)`. Erase memories or drop in whole new personalities if you want!

## TypeScript Support

This is a TypeScript project, so type definitions are available in: `dist/index.d.ts`. These help a lot when building cores, but feel free to use vanilla JS if you want.

## ISC License

Copyright 2019 Justin Mahar

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.