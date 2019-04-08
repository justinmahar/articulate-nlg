import _ from "lodash";
const weightedRandom: any = require("weighted-random");

/**
 * An action occurs while articulating a sentiment. An action directs the speech generation.
 */
export interface IAction {
  // Only one of these should be specified.
  /** Generates the speech provided. */
  say?: string;
  /** Generates speech for another sentiment. */
  articulate?: string;
  /** Generates the value of the provided key in the context object provided when calling articulate. */
  sayContext?: string;

  /** Capitalizes the first letter of the generated text. */
  capitalize?: boolean;
}

/**
 * A sentiment contains a single action or list of actions
 * to carry out when articulating. The action may also just be a string which will be spoken.
 *
 * A sentiment also contains an optional weight that determines how likely it is that this sentiment
 * occurs when paired with other sentiments. If not provided, the weight defaults to 1.
 */
export interface ISentiment {
  do: (IAction | string)[] | IAction | string;
  weight?: number;
}

/**
 * A core contains all sentiments for a Persona.
 *
 * Each name in the sentiments property maps to either a single sentiment, single string (which is spoken),
 * or a list of sentiments.
 *
 * Sentiments for a particular name are randomly chosen during articulation. The selection is based on
 * weights for each item. Weights default to 1, and if no weights are provided, all sentiments for that
 * name are equally likely to occur.
 *
 * For instance, the "greet" name might map to ["hello", "hi", and "hey"]. Since weights aren't provided,
 * articulating "greet" would randomly select from those three items, and all would be equally likely to
 * occur.
 */
export interface ICore {
  sentiments: {
    [name: string]: (ISentiment | string)[] | ISentiment | string;
  };
}

/**
 * A Persona can articulate thoughts, a.k.a. sentiments, by generating speech as strings. This speech logic is defined by
 * a "core" that's provided to the Persona on construction.
 */
export class Persona {
  /**
   * Construct a new Persona.
   *
   * @param core The core for this persona. A core contains all sentiments and the speech generated for them.
   */
  constructor(public core: ICore) {}

  /**
   * Reduces the provided action to a string which is to be "said" by the persona.
   */
  sayAction = (action: IAction, context: any): string => {
    let utterance = "<unknown action>";

    if (action.say) {
      utterance = action.say;
    } else if (action.articulate) {
      utterance = this.articulate(action.articulate, context);
    } else if (action.sayContext) {
      let value = context[action.sayContext];
      utterance = value ? value : "<" + action.sayContext + ">";
    }

    if (action.capitalize) {
      utterance = _.capitalize(utterance);
    }

    return utterance;
  };

  /**
   * Articulates the provided sentiment, returning the utterance as a string.
   * The sentiment string represents a "thought" that is being
   * spoken by the persona, and the result returned is the generated language.
   *
   * A sentiment may be articulated in a variety of ways, so the returned string
   * is expected to vary, but will still convey the sentiment.
   *
   * A context object can be provided for personas that expect one. These can contain properties
   * to be expressed during articulation. For instance, a particular persona may expect
   * a first name property, a zodiac sign property, birth date property, etc.
   *
   * @param sentiment The sentiment to articulate, as a string.
   * @param context An optional context Object containing properties expected by a persona, such as a
   *                first name.
   *
   * @returns The string articulated by this persona for the sentiment provided. This can (and most
   *          likely will) be different every time.
   */
  articulate = (sentiment: string, context: any = {}): string => {
    let utterance: string = "<" + sentiment + ">";

    if (this.core.sentiments[sentiment]) {
      let arrayOrSentimentOrString:
        | (ISentiment | string)[]
        | ISentiment
        | string = this.core.sentiments[sentiment];

      let selectedSentimentOrString:
        | ISentiment
        | string
        | undefined = undefined;

      // If they sentiment maps to an array of possibilities...
      if (Array.isArray(arrayOrSentimentOrString)) {
        // We want to select a random item based on the weights.
        var weights = arrayOrSentimentOrString.map(stringOrSentiment => {
          return typeof stringOrSentiment !== "string" &&
            stringOrSentiment.weight
            ? stringOrSentiment.weight
            : 1;
        });
        let selectedIndex = weightedRandom(weights);
        selectedSentimentOrString = arrayOrSentimentOrString[selectedIndex];
      }
      // Otherwise it's a sentiment or a string
      else {
        selectedSentimentOrString = arrayOrSentimentOrString;
      }

      if (selectedSentimentOrString) {
        // If it's a string, that's sugar for a say action
        // with that string, which is to be said.
        if (typeof selectedSentimentOrString === "string") {
          utterance = selectedSentimentOrString;
        }
        // Otherwise, it's a sentiment object! This has a
        // "do" property that contains actions or strings to say
        // in sequence.
        else {
          let actions = selectedSentimentOrString.do;
          if (Array.isArray(actions)) {
            utterance = actions.reduce((cumulative: string, currentAction) => {
              if (typeof currentAction === "string") {
                return cumulative + currentAction;
              } else {
                return cumulative + this.sayAction(currentAction, context);
              }
            }, "");
          } else if (typeof actions === "string") {
            utterance = actions;
          } else {
            utterance = this.sayAction(actions, context);
          }
        }
      }
    }

    return utterance;
  };

  /**
   * Articulates all sentiments, joining the generated speech using the separator provided (or a space by default).
   *
   * @param sentiments The names of all sentiments to articulate.
   * @param context Optional context for articulating.
   * @param separator Optional separator inserted between generated speech. Defaults to a space.
   * @returns The speech generated for all sentiments, joined by the separator provided or a space if none was provided.
   */
  articulateAll = (
    sentiments: string[],
    context: any = {},
    separator: string = " "
  ) => {
    return sentiments
      .map(sentiment => {
        return this.articulate(sentiment, context);
      })
      .join(separator);
  };
}
