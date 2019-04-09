import _ from "lodash";
const seedrandom = require("seedrandom");

/**
 * A Persona can articulate concepts by generating speech as strings containing text. This speech logic is defined by
 * a "core" that's provided to the Persona on construction.
 */
export class Persona {
  /**
   * Construct a new Persona using the provided core.
   *
   * @param core The core for this persona. A core contains all concepts and the resolvers that generate text for them.
   */
  constructor(public core: ICore) {}

  /**
   * Generates text using the generator provided. Don't call this directly on a persona.
   *
   * @param generator The generator to create text from.
   * @param context Optional context object used by the generator to pull text from.
   */
  private generateTextForGenerator = (
    generator: IGenerator,
    context: any = {},
    seed: any = Math.random()
  ): string => {
    let text = "<unknown generator>";

    if (generator.text) {
      text = generator.text;
    } else if (generator.articulate) {
      text = this.articulate(generator.articulate, context, seed);
    } else if (generator.contextProp) {
      let value = context[generator.contextProp];
      value = value ? value : generator.contextDefault;
      text = value ? value : "<" + generator.contextProp + ">";
    }

    if (generator.capitalize) {
      text = _.capitalize(text);
    }

    return text;
  };

  /**
   * Articulates the provided concept, returning the generated speech as a string containing text. Providing `--help` articulates
   * all concept names this persona can articulate. You can call `articulateHelp()` directly as well.
   *
   * The concept string represents a "thought" that is being
   * articulated by the persona, and the resulting string returned is the generated text that represents the concept.
   *
   * A concept may be articulated in a variety of ways, so the returned string
   * is expected to vary, but will still convey the concept in one way or another.
   *
   * A context object can be provided for personas that expect one. These can contain properties
   * to be expressed during articulation. For instance, a particular persona may expect
   * a firstName property, a zodiacSign property, birthDate property, etc. In cases where
   * such an expectation exists, check the core's documentation.
   *
   * @param conceptName The name of the concept to articulate as a string.
   * @param context An optional context Object containing properties expected by a persona, such as firstName.
   *
   * @returns The speech text articulated by this persona for the concept provided. This can (and most
   *          likely will) be different every time for a particular concept.
   */
  articulate = (
    conceptName: string,
    context: any = {},
    seed: any = Math.random()
  ): string => {
    let text: string = "<" + conceptName + ">";

    if (this.core.conceptResolvers[conceptName]) {
      let arrayOrResolverOrString:
        | (IResolver | string)[]
        | IResolver
        | string = this.core.conceptResolvers[conceptName];

      let selectedResolverOrString: IResolver | string | undefined = undefined;

      // If the concept maps to an array of possibilities...
      if (Array.isArray(arrayOrResolverOrString)) {
        // We want to select a random item based on the weights.
        var weights = arrayOrResolverOrString.map(stringOrResolver => {
          return typeof stringOrResolver !== "string" && stringOrResolver.weight
            ? stringOrResolver.weight
            : 1;
        });
        let selectedIndex = weightedRandom(weights, seed);
        selectedResolverOrString = arrayOrResolverOrString[selectedIndex];
      }
      // Otherwise it's a resolver or a string!
      else {
        selectedResolverOrString = arrayOrResolverOrString;
      }

      if (selectedResolverOrString) {
        // If it's a string, that's a shortcut for text generation
        // using that string.
        if (typeof selectedResolverOrString === "string") {
          text = selectedResolverOrString;
        }
        // Otherwise, it's a resolver! This has a `do` property that contains generators
        // or text to be concatenated together. We're almost there...
        else {
          let textOrArrayOfGenerators = selectedResolverOrString.do;
          // If it's an array, concatenate all the generated text together.
          if (Array.isArray(textOrArrayOfGenerators)) {
            text = textOrArrayOfGenerators.reduce(
              (cumulative: string, currentItem) => {
                if (typeof currentItem === "string") {
                  return cumulative + currentItem;
                } else {
                  return (
                    cumulative +
                    this.generateTextForGenerator(currentItem, context, seed)
                  );
                }
              },
              ""
            );
          }
          // If it's a string, use this as the generated text.
          else if (typeof textOrArrayOfGenerators === "string") {
            text = textOrArrayOfGenerators;
          }
          // Otherwise, use the generator to generate the text.
          else {
            text = this.generateTextForGenerator(
              textOrArrayOfGenerators,
              context,
              seed
            );
          }
        }
      }
    } else if (conceptName === "--help") {
      text = this.articulateHelp();
    }

    return text;
  };

  /**
   * Articulates the names of the concepts this persona can articulate.
   */
  articulateHelp = (): string => {
    let keys: string[] = Object.keys(this.core.conceptResolvers);
    let text: string = this.core.helpText
      ? "🤷"
      : "My core is empty! I can't articulate any concepts. 🤷";

    if (keys.length > 0) {
      text =
        (this.core.helpText
          ? this.core.helpText
          : "I can articulate the following concepts:") +
        "\n" +
        keys.map((key: string) => "- " + key).join("\n");
    }

    return text;
  };

  /**
   * Returns the names of all concepts this persona can articulate.
   *
   * @return A string array containing the names of all concepts this persona can articulate.
   */
  getConceptNames = (): string[] => Object.keys(this.core.conceptResolvers);

  /**
   * Returns the persona's core. Handle with care :)
   */
  getCore = (): ICore => this.core;

  /**
   * Sets the persona's core.
   * @param core The new core.
   */
  setCore = (core: ICore) => {
    this.core = core;
  };
}

/**
 * A core contains all concepts for a Persona. Think of it as the brain!
 *
 * Each concept name in the conceptResolvers property maps to either a single resolver, a single string as the generated text,
 * or a list of resolvers/text. Resolvers provide the generators that are used to generate text.
 *
 * Resolvers/text for a particular concept are randomly chosen during articulation. The selection is based on
 * weights for each resolver provided for that concept. Weights default to 1, and if no weights are provided, all resolvers for that
 * concept are equally likely to occur. If strings are provided, the weights for those default to 1 as well. If only
 * one resolver (or just a string of text) is provided, it's always selected.
 *
 * For instance, the "greet" concept might map to a list, `["hello", "hi", "hey"]`. Since these are just strings,
 * articulating "greet" would generate text by randomly selecting one of those three strings, and all would be
 * equally likely to occur since their weights are all 1 by default (1/3 chance each).
 *
 * If the list were something like: `[{do: {text: "hello"}, weight: 18}, "hi", "hey"]`, then "hello" would have
 * an 18/20 chance of being selected, while "hi" and "hey" would each have a 1/20 chance.
 *
 * There is a resolver that articulates other concepts, making it possible to reuse them. For instance, a `greet`
 * concept could be reused in a `how-was-your-day` concept, which could start by articulating `greet` and
 * then asking how someone's day was. The `greet` concept might resolve in a dozen different ways, making the greeting
 * different every time. Layer your concepts like this and your speech will seem much more organic!
 */
export interface ICore {
  /** Concept names mapped to their resolvers, or to strings representing generated text. */
  conceptResolvers: {
    [conceptName: string]: (IResolver | string)[] | IResolver | string;
  };

  /**
   * Used when articulating `--help` or when calling `articulateHelp()`. This text will be generated
   * followed by a list of concept names that can be articulated. Specify this if your core is not written in English.
   */
  helpText?: string;
}

/**
 * A resolver generates text for a concept using generators.
 *
 * Each resolver contains a `do` property mapped to a single generator, or list of generators, to use when articulating a concept.
 * If a list of generators is provided, each one generates text and the results of each are concatenated.
 *
 * The value of `do` may also just be a string which will itself will become the text generated.
 *
 * A resolver also contains an optional weight that determines how likely it is that this resolver
 * is chosen when it is adjacent to other resolvers in a list. If a weight is not provided, the weight defaults to 1.
 */
export interface IResolver {
  /**
   * A generator that resolves the text, a list of generators or strings to concatenate text from, or a string containing the text itself.
   */
  do: (IGenerator | string)[] | IGenerator | string;
  /** When paired with other resolvers, a higher weight makes this resolver more likely to be chosen. Defaults to 1 if not provided. */
  weight?: number;
}

/**
 * A generator directs the actual text used during speech generation.
 *
 * - `text?` - The text generated. Overrides `articulate` and `contextProp`.
 * - `articulate?` - Articulates another concept and uses the text it generates. Be careful to avoid infinite referential loops. Overrides `contextProp`.
 * - `contextProp?` - Value of a property specified in the context object (passed in when calling `articulate()`).
 * - `contextDefault?` - Fallback value used when `contextProp` property is undefined in the context object. If a default is not specifed and a context property is missing, the name of the property is generated between angle brackets, like so: `<contextProp>`.
 *
 * If none of the above are provided, the generator creates the text `<unknown generator>`.
 *
 * Options:
 *
 * - `capitalize?` - When true, the first letter of the text will be capitalized. Default to false.
 */
export interface IGenerator {
  /** Generates the text provided. */
  text?: string;
  /** Generates speech for another concept. */
  articulate?: string;
  /** Generates the value of the provided context property. */
  contextProp?: string;
  /**
   * Default when a `contextProp` is specified but undefined.
   * For instance, if a `name` context property is missing, you could default it to "friend".
   */
  contextDefault?: string;

  /** Capitalizes the first letter of the generated text. Default false. */
  capitalize?: boolean;
}

function weightedRandom(weights: number[], seed: any = Math.random()): number {
  let cumulative: number = 0;
  let ranges: number[] = weights.map(weight => (cumulative += weight));
  let seededRand = new seedrandom(seed);
  let selectedValue = seededRand() * cumulative;
  for (let index = 0; index < ranges.length; index++) {
    if (selectedValue <= ranges[index]) {
      return index;
    }
  }
  return -1;
}