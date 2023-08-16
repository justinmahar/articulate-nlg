import Chooser from 'random-seed-weighted-chooser';

export interface WeightedText {
  t: Text;
  w: number;
}

export interface ParamTextPair {
  p: string;
  t: Text;
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

export type StringFunction = () => string;

export type Text = string | StringFunction;

const toWeightedTexts = (texts: (Text | WeightedText)[]): WeightedText[] => {
  return texts.map((val: Text | WeightedText): WeightedText => {
    if (typeof val === 'string' || typeof val === 'function') {
      return { t: val, w: 1 };
    }
    return val;
  });
};

export class Persona {
  public vocab: Vocabulary;
  private params: PersonaParams;
  private cycledTextsGroups: CycledTexts;

  constructor() {
    this.vocab = {};
    this.params = {};
    this.cycledTextsGroups = {};
  }

  public articulate = (vocabKey: string, params: any = {}): string => {
    return this.say(vocabKey, params);
  };

  protected say = (vocabKey: string, params: any = this.params): string => {
    this.params = params;
    const val = this.vocab[vocabKey];
    if (typeof val === 'undefined') {
      console.warn('Vocab key "' + vocabKey + '" not found. Using empty string.');
    }
    return this.render(val);
  };

  protected capitalize = (text: Text): string => {
    const renderedText = this.render(text);
    return renderedText.charAt(0).toUpperCase() + renderedText.slice(1);
  };

  protected sb = (text: Text): string => {
    return ' ' + this.render(text);
  };

  protected sa = (text: Text): string => {
    return this.render(text) + ' ';
  };

  protected sba = (text: Text): string => {
    return ' ' + this.render(text) + ' ';
  };

  protected capSay = (vocabKey: string, params: any = this.params): string => {
    return this.capitalize(this.say(vocabKey, params));
  };

  protected render = (val: any): string => {
    if (typeof val === 'function') {
      // Call it and render the value, which could be anything.
      return this.render(val());
    } else if (typeof val === 'string') {
      return val;
    } else if (!!val) {
      if (!!val.t && !!val.w) {
        // It's a weighted text.
        return this.render(val.t);
      } else {
        return val + '';
      }
    } else {
      return '';
    }
  };

  protected choose = (...texts: (Text | WeightedText)[]): string => {
    const weightedTexts: WeightedText[] = toWeightedTexts(texts);
    const choice: any = Chooser.chooseWeightedObject(weightedTexts, 'w');
    if (!!choice && typeof choice.t !== 'undefined') {
      return this.render(choice.t);
    } else {
      console.warn('Choice returned a bad value for:', texts);
      return '';
    }
  };

  protected weighted = (text: Text, weight = 1): WeightedText => {
    return { t: text, w: weight };
  };

  protected chance = (text: Text, chance: number): string => {
    chance = Math.min(1, Math.max(0, chance));
    const noopChance: number = Math.min(1, Math.max(0, 1 - chance));
    const textWeighted: WeightedText = { t: text, w: chance };
    const noopWeighted: WeightedText = { t: '', w: noopChance };
    return this.choose(noopWeighted, textWeighted);
  };

  private getCycledTextsFor(groupName: string): string[] {
    const cycledTexts: string[] | undefined = this.cycledTextsGroups[groupName];
    if (!!cycledTexts) {
      return cycledTexts;
    } else {
      this.cycledTextsGroups[groupName] = [];
      return this.cycledTextsGroups[groupName];
    }
  }

  protected cycle = (group: CycleGroup, ...texts: (Text | WeightedText)[]): string => {
    const weightedTexts: WeightedText[] = toWeightedTexts(texts);
    const cycledTexts: string[] = this.getCycledTextsFor(group.group);
    let filtered: WeightedText[] = weightedTexts.filter((val: WeightedText) => {
      return val.w !== 0 && !cycledTexts.includes(this.render(val.t));
    });

    // If they've all been used...
    if (filtered.length === 0) {
      // Choose from any of them
      filtered = weightedTexts;
      // And remove all items from the cycled texts array
      weightedTexts.forEach((val: WeightedText) => {
        const index = cycledTexts.indexOf(this.render(val.t));
        if (index >= 0) {
          cycledTexts.splice(index, 1);
        }
      });
    }

    const chosen = this.choose(...filtered);
    cycledTexts.push(chosen);
    return chosen;
  };

  protected maybe = (...texts: (Text | WeightedText)[]): string => {
    return this.choose('', this.choose(...texts));
  };

  protected param = (paramKey: string): string => {
    const val = this.params[paramKey];
    return this.render(val);
  };

  protected ifThen = (paramKey: string, then: Text): string => {
    return this.ifElse(paramKey, then, '');
  };

  protected ifNot = (paramKey: string, then: Text): string => {
    return this.ifElse(paramKey, '', then);
  };

  protected ifElse = (paramKey: string, then: Text, otherwise: any): string => {
    if (!!this.params[paramKey]) {
      return this.render(then);
    } else {
      return this.render(otherwise);
    }
  };

  protected doFirst = (paramTextPairs: ParamTextPair[], defaultText: Text = ''): string => {
    for (let i = 0; i < paramTextPairs.length; i++) {
      const pair = paramTextPairs[i];
      const paramKey = pair.p;
      const value = pair.t;
      if (!!this.params[paramKey]) {
        return this.render(value);
      }
    }

    return this.render(defaultText);
  };
}
