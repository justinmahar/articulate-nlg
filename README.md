# Conceptual NLG

A natural language generator that articulates simple thoughts as words, phrases, and sentences.

# Persona Development

Want to create your own persona? Here's how!

## Development Overview

With Conceptual NLG, you can define personas that can articulate concepts (represented as strings) as speech text.

- For instance, a particular persona might articulate the concept `"greet"` as `"hello"`, `"hi"`, or `"hey"`.
- Another persona might articulate that same concept as `"oy!"`, `"yo!"`, or `"sup!"`.

The generated text for a concept is typically random and can even reference other concepts, allowing you to define millions of permutations elegantly.

The specification also allows you to vary the randomness so you can bend speech patterns to your liking! You can also define a "context" object that your persona can reference for things like using someone's name in the generated text.

## Personas and Cores

A persona is powered by a core, which contains all the concept definitions and generated speech. Think of the core as the brain for a persona.

When you want to generate speech for a concept, you call `articulate()` on the persona.

For example:

```ts
let core = { conceptResolvers: { greet: ["hello", "hi", "hey"] } };
let brianna = new Persona(core);

brianna.articulate("greet"); // hello, hi, or hey
```

So, how does Brianna know which greeting to say? Well, the core contains concept names (such as "greet") which are mapped to resolvers, such as "hello", "hi", and "hey".

If more than one resolver is specified, one of them is randomly chosen.

But things can get more advanced than that! Keep reading...

## Resolvers

### `do`

Resolvers can be more complicated than just providing strings. In fact, providing a string (as shown above with "hello", "hi", or "hey") is actually shorthand for:

```
{do: {text: "hello"}}
```

So if you expand the example above out, it _could_ look like this (and would produce the same results!):

```ts
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

brianna.articulate("greet"); // hello, hi, or hey
```

What's going on here?

Well, `greet` is being mapped to a list of objects, and each one of those is what's called a **resolver**. When articulating, the persona picks one of these resolvers to resolve the concept as speech text.

Each resolver has two properties: `do`, which specifies either a single generator (which creates text, more on that in a second), a list of generators/text, or just some text.

### `weight`

Each resolver also has a `weight` property that defaults to `1`. The weight determines how likely it is for the persona to use a particular resolver when articulating speech.

In the example above, all text has an equal chance of being picked.

Let's change these numbers a bit:

```ts
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

// 5% chance of "hello"
// 94% chance of "hi"
// 1% chance of "hey"
brianna.articulate("greet");
```

If we shift the weights around a bit, we can make certain resolvers more or less likely to be chosen.

So a persona has a core, which acts as the brain.

That core has concepts that map to resolvers, which are picked randomly each time a persona articulates a particular concept. 

Resolvers do a bunch of things to generate text, and the randomness of resolver selection can be tweaked by applying different weights to the resolvers.

With me so far? :) Great, let's continue.

## Generators

TBD

## Context

TBD

## Seeds

TBD