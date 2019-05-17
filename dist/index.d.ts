export interface WeightedText {
    t: string | (() => string);
    w: number;
}
export interface ParamTextPair {
    p: string;
    t: string | (() => string);
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
export default class Persona {
    vocab: Vocabulary;
    private params;
    private cycledTextsGroups;
    constructor();
    articulate: (vocabKey: string, params?: any) => string;
    protected say: (vocabKey: string, params?: any) => string;
    protected capitalize: (text: string) => string;
    protected sb: (text: string) => string;
    protected sa: (text: string) => string;
    protected sba: (text: string) => string;
    protected capSay: (vocabKey: string, params?: any) => string;
    protected render: (val: any) => string;
    protected choose: (...texts: (string | WeightedText | (() => string))[]) => string;
    protected weighted: (text: string | (() => string), weight?: number) => WeightedText;
    protected chance: (text: string, chance: number) => string;
    private getCycledTextsFor;
    protected cycle: (group: CycleGroup, ...texts: (string | WeightedText | (() => string))[]) => string;
    protected maybe: (...texts: (string | WeightedText | (() => string))[]) => string;
    protected param: (paramKey: string) => string;
    protected ifThen: (paramKey: string, then: any) => string;
    protected ifNot: (paramKey: string, then: any) => string;
    protected ifElse: (paramKey: string, then: any, otherwise: any) => string;
    protected doFirst: (paramTextPairs: ParamTextPair[], defaultText?: string) => string;
}
