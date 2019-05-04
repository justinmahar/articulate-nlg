import Chooser from "random-seed-weighted-chooser";

export interface WeightedText {
  t: string;
  w: number;
}

export interface ParamTextPair {
  p: string;
  t: string;
}

export interface Vocabulary {
  [key: string]: Function;
}

export interface PersonaParams {
  [key: string]: any;
}

export interface CycledTexts {
  [key: string]: string[];
}

export interface CycleGroup {
  group: string;
}

let toWeightedTexts = (texts: (string | WeightedText)[]): WeightedText[] => {
  return texts.map(
    (val: string | WeightedText): WeightedText => {
      if (typeof val === "string") {
        return { t: val, w: 1 };
      }
      return val;
    }
  );
};

export default class Persona {
  public vocab: Vocabulary;
  private params: PersonaParams;
  private cycledTextsGroups: CycledTexts;

  constructor() {
    this.vocab = {};
    this.params = {};
    this.cycledTextsGroups = {};
  }

  articulate = (vocabKey: string, params: any = {}): string => {
    return this.say(vocabKey, params);
  };

  protected say = (vocabKey: string, params: any = this.params): string => {
    this.params = params;
    let val = this.vocab[vocabKey];
    if (typeof val === "undefined") {
      console.warn(
        'Vocab key "' + vocabKey + '" not found. Using empty string.'
      );
    }
    return this.render(val);
  };

  protected capitalize = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  protected sb = (text: string): string => {
    return " " + text;
  };

  protected sa = (text: string): string => {
    return text + " ";
  };

  protected sba = (text: string): string => {
    return " " + text + " ";
  };

  protected capSay = (vocabKey: string, params: any = this.params): string => {
    return this.capitalize(this.say(vocabKey, params));
  };

  protected render = (val: any): string => {
    if (typeof val === "function") {
      // Call it and render the value, which could be anything.
      return this.render(val());
    } else if (typeof val === "string") {
      return val;
    } else if (!!val) {
      return val + "";
    } else {
      return "";
    }
  };

  protected choose = (...texts: (string | WeightedText)[]): string => {
    let weightedTexts: WeightedText[] = toWeightedTexts(texts);
    let choice: any = Chooser.chooseWeightedObject(weightedTexts, "w");
    return this.render(choice["t"]);
  };

  protected weighted = (text: string, weight: number = 1): WeightedText => {
    return { t: text, w: weight };
  };

  protected chance = (text: string, chance: number): string => {
    chance = Math.min(1, Math.max(0, chance));
    let noopChance: number = Math.min(1, Math.max(0, 1 - chance));
    let textWeighted: WeightedText = { t: text, w: chance };
    let noopWeighted: WeightedText = { t: "", w: noopChance };
    return this.choose(noopWeighted, textWeighted);
  };

  private getCycledTextsFor(groupName: string): string[] {
    let cycledTexts: string[] | undefined = this.cycledTextsGroups[groupName];
    if (!!cycledTexts) {
      return cycledTexts;
    } else {
      this.cycledTextsGroups[groupName] = [];
      return this.cycledTextsGroups[groupName];
    }
  }

  protected cycle = (
    group: CycleGroup,
    ...texts: (string | WeightedText)[]
  ): string => {
    let weightedTexts: WeightedText[] = toWeightedTexts(texts);
    let cycledTexts: string[] = this.getCycledTextsFor(group.group);
    let filtered: WeightedText[] = weightedTexts.filter((val: WeightedText) => {
      return !cycledTexts.includes(val.t);
    });

    // If they've all been used...
    if (filtered.length === 0) {
      // Choose from any of them
      filtered = weightedTexts;
      // And remove all items from the cycled texts array
      weightedTexts.forEach((val: WeightedText) => {
        var index = cycledTexts.indexOf(val.t);
        if (index >= 0) {
          cycledTexts.splice(index, 1);
        }
      });
    }
    //console.log(group.group, "Choosing from:", filtered, "Used up:", cycledTexts);

    let chosen = this.choose(...filtered);
    cycledTexts.push(chosen);
    //console.log(group.group, "Choice:", chosen, "Used up after choice:", cycledTexts);
    return chosen;
  };

  protected maybe = (...texts: string[]): string => {
    return this.choose("", this.choose(...texts));
  };

  protected param = (paramKey: string): string => {
    let val = this.params[paramKey];
    return this.render(val);
  };

  protected ifThen = (paramKey: string, then: any): string => {
    return this.ifElse(paramKey, then, "");
  };

  protected ifNot = (paramKey: string, then: any): string => {
    return this.ifElse(paramKey, "", then);
  };

  protected ifElse = (paramKey: string, then: any, otherwise: any): string => {
    if (!!this.params[paramKey]) {
      return this.render(then);
    } else {
      return this.render(otherwise);
    }
  };

  protected doFirst = (
    paramTextPairs: ParamTextPair[],
    defaultText: string = ""
  ): string => {
    for (var i = 0; i < paramTextPairs.length; i++) {
      let pair = paramTextPairs[i];
      let paramKey = pair.p;
      let value = pair.t;
      if (!!this.params[paramKey]) {
        return this.render(value);
      }
    }

    return this.render(defaultText);
  };
}

/*
class Justin extends Persona {
  createVocab = () => {
    let say = this.say;
    let capSay = this.capSay;
    let choose = this.choose;
    let maybe = this.maybe;
    let cycle = this.cycle;
    let param = this.param;
    let doFirst = this.doFirst;
    return {
      greet: (): string =>
        capSay("hi") +
        "-" +
        cycle("1", "2", "3", "4", "5") +
        "-" +
        cycle("2", "1", "3", "4", "5") +
        "-" +
        choose("hi", "hey", "hello", "what's up") +
        "-" +
        maybe(say("hi")) +
        say("name") +
        doFirst([{ p: "name", t: say("name") }], "not found"),
      hi: () => "hiiii",
      num: () => 6,
      name: (): string => param("name")
    };
  };
  vocab = this.createVocab();
}

let justin = new Justin();
let count = 100;
new Array(count).fill(0).forEach(() => {
  let params = { name: "justin" };
  console.log(justin.say("greet", params));
});
*/
