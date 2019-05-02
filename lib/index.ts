import Chooser from "random-seed-weighted-chooser";

interface WeightedVocab {
  t: string;
  w: number;
}

interface ParamValuePair {
  p: string;
  t: any;
}

interface Vocabulary {
  [key: string]: Function
}

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
let hashCode = (text: string) => {
  var hash = 0,
    i,
    chr;
  if (text.length === 0) return hash;
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

let toWeightedVocabs = (texts: (string | WeightedVocab)[]): WeightedVocab[] => {
  return texts.map(
    (val: string | WeightedVocab): WeightedVocab => {
      if (typeof val === "string") {
        return { t: val, w: 1 };
      }
      return val;
    }
  );
};

export default class Persona {
  constructor(
    public vocab: Vocabulary = {},
    private params: any = {},
    private cycledTextsGroups: any = {}
  ) {}

  say = (vocabKey: string, params: any = this.params): string => {
    this.params = params;
    let val = this.vocab[vocabKey];
    return this.render(val);
  };

  capitalize = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  capSay = (vocabKey: string, params: any = this.params): string => {
    return this.capitalize(this.say(vocabKey, params));
  };

  render = (val: any): string => {
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

  choose = (...texts: (string | WeightedVocab)[]): string => {
    let weightedVocabs: WeightedVocab[] = toWeightedVocabs(texts);
    let choice: any = Chooser.chooseWeightedObject(weightedVocabs, "w");
    return this.render(choice["t"]);
  };

  private getCycledTextsFor(hash: string): string[] {
    let cycledTexts: string[] | undefined = this.cycledTextsGroups[hash];
    if (!!cycledTexts) {
      return cycledTexts;
    } else {
      this.cycledTextsGroups[hash] = [];
      return this.cycledTextsGroups[hash];
    }
  }

  cycle = (...texts: (string | WeightedVocab)[]): string => {
    let weightedVocabs: WeightedVocab[] = toWeightedVocabs(texts);
    // Create a hash that's used to group the items provided.
    // This prevents global cycling and increases search performance.
    let textsHash: string =
      hashCode(weightedVocabs.map((val: WeightedVocab) => val.t).join("")) + "";
    let cycledTexts: string[] = this.getCycledTextsFor(textsHash);
    // console.log(textsHash, cycledTexts);
    let filtered: WeightedVocab[] = weightedVocabs.filter(
      (val: WeightedVocab) => {
        return !cycledTexts.includes(val.t);
      }
    );

    // If they've all been used...
    if (filtered.length === 0) {
      // Choose from any of them
      filtered = weightedVocabs;
      // And remove all items from the cycled texts array
      weightedVocabs.forEach((val: WeightedVocab) => {
        var index = cycledTexts.indexOf(val.t);
        if (index >= 0) {
          cycledTexts.splice(index, 1);
        }
      });
    }

    let chosen = this.choose(...filtered);
    cycledTexts.push(chosen);
    return chosen;
  };

  maybe = (text: string): string => {
    return this.choose("", text);
  };

  param = (paramKey: string): string => {
    let val = this.params[paramKey];
    return this.render(val);
  };

  ifThen = (paramKey: string, then: any): string => {
    return this.ifElse(paramKey, then, "");
  };

  ifNot = (paramKey: string, then: any): string => {
    return this.ifElse(paramKey, "", then);
  };

  ifElse = (paramKey: string, then: any, otherwise: any): string => {
    if (!!this.params[paramKey]) {
      return this.render(then);
    } else {
      return this.render(otherwise);
    }
  };

  doFirst = (
    paramTextPairs: ParamValuePair[],
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