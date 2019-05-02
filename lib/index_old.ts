import Mustache from "mustache";
import Chooser from "random-seed-weighted-chooser";

let defaultCore: Object = {
  capitalize: (): Function => {
    return (text: string, render: Function): string => {
      let renderedText = render(text);
      return renderedText.charAt(0).toUpperCase() + renderedText.slice(1);
    };
  },
  choose: (): Function => {
    return (text: string, render: Function): string => {
      let segments = text.split("|");
      let segmentsWithWeights: any = [];
      let regex: RegExp = /(.*)[=]([0-9]*[.]?[0-9]+)/;
      segments.forEach(segment => {
        let match: RegExpMatchArray | null = segment.match(regex);
        if (match !== null && match.length >= 2) {
          segmentsWithWeights.push({
            value: match[1],
            weight: parseFloat(match[2])
          });
        } else {
          segmentsWithWeights.push({ value: segment, weight: 1 });
        }
      });
      let chosen: any = Chooser.chooseWeightedObject(segmentsWithWeights);
      let renderedText: string = render(chosen.value);
      return renderedText;
    };
  }
};

export default class Persona {
  constructor(public vocab: Object = {}, public core: Object = defaultCore) {}

  say = (template: string, params = {}): string => {
    return Mustache.render(
      `{{>${template}}}`,
      { ...this.core, params: params },
      this.vocab
    );
  };
}

interface WeightedVocab {
  v: string;
  w: number;
}

interface ParamTextPair {
  p: string;
  t: string;
}

let preventNesting = (
  stringToCheck: string,
  tag: string,
  returnIfValid: string,
  returnIfInvalid: string
): string => {
  if (stringToCheck.indexOf(tag) >= 0) {
    console.warn(
      `Can't nest ${tag}. Make into another partial and reference it instead.`,
      `Defaulting to ${returnIfInvalid}`,
      "For:",
      stringToCheck
    );
    return returnIfInvalid;
  }
  return returnIfValid;
};

export class VocabHelpers {
  static capitalize = (text: string): string => {
    return preventNesting(
      text,
      "{{#capitalize}}",
      `{{#capitalize}}${text}{{/capitalize}}`,
      text
    );
  };

  static choose = (texts: (string | WeightedVocab)[]): string => {
    let firstValue: string = "";
    let parts = texts.map(val => {
      if (typeof val === "string") {
        firstValue = !!firstValue ? firstValue : val;
        return val;
      } else {
        firstValue = !!firstValue ? firstValue : val.v;
        return val.v + "=" + val.w;
      }
    });
    let joinedParts = parts.join("|");
    return preventNesting(
      joinedParts,
      "{{#choose}}",
      "{{#choose}}" + joinedParts + "{{/choose}}",
      firstValue
    );
  };

  static maybe = (text: string): string => {
    return VocabHelpers.choose([text, ""]);
  };

  static say = (vocabKey: string): string => {
    return `{{>${vocabKey}}}`;
  };

  static capSay = (text: string): string => {
    let articulated:string = VocabHelpers.say(text);
    let capitalized:string = VocabHelpers.capitalize(articulated);
    return capitalized;
  };

  static param = (paramKey: string) => {
    return `{{params.${paramKey}}}`;
  };

  static ifThen = (paramKey: string, thenText: string) => {
    return preventNesting(
      thenText,
      `{{#params.${paramKey}}}`,
      `{{#params.${paramKey}}}${thenText}{{/params.${paramKey}}}`,
      thenText
    );
  };

  static ifNot = (paramKey: string, thenText: string) => {
    return preventNesting(
      thenText,
      `{{^params.${paramKey}}}`,
      `{{^params.${paramKey}}}${thenText}{{/params.${paramKey}}}`,
      thenText
    );
  };

  static ifElse = (
    paramKey: string,
    thenText: string,
    elseText: string
  ): string => {
    return `${VocabHelpers.ifThen(paramKey, thenText)}${VocabHelpers.ifNot(
      paramKey,
      elseText
    )}`;
  };

  static doFirst = (
    paramTextPairs: ParamTextPair[],
    defaultText: string = ""
  ) => {
    // Each if/else goes inside the previous.
    // So I put my thang down, slice it and reverse it.
    // The slice creates a new array since reverse() affects the original.
    let template = paramTextPairs
      .slice()
      .reverse()
      .reduce((acc, curr) => {
        let paramKey = curr.p;
        let value = curr.t;
        return VocabHelpers.ifElse(paramKey, value, acc);
      }, defaultText);
    return template;
  };
}