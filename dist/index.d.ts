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
export declare type StringFunction = () => string;
export declare type Text = string | StringFunction;
export default class Persona {
    vocab: Vocabulary;
    private params;
    private cycledTextsGroups;
    constructor();
    articulate: (vocabKey: string, params?: any) => string;
    protected say: (vocabKey: string, params?: any) => string;
    protected capitalize: (text: Text) => string;
    protected sb: (text: Text) => string;
    protected sa: (text: Text) => string;
    protected sba: (text: Text) => string;
    protected capSay: (vocabKey: string, params?: any) => string;
    protected render: (val: any) => string;
    protected choose: (...texts: (string | WeightedText | StringFunction)[]) => string;
    protected weighted: (text: Text, weight?: number) => WeightedText;
    protected chance: (text: Text, chance: number) => string;
    private getCycledTextsFor;
    protected cycle: (group: CycleGroup, ...texts: (string | WeightedText | StringFunction)[]) => string;
    protected maybe: (...texts: (string | WeightedText | StringFunction)[]) => string;
    protected param: (paramKey: string) => string;
    protected ifThen: (paramKey: string, then: Text) => string;
    protected ifNot: (paramKey: string, then: Text) => string;
    protected ifElse: (paramKey: string, then: Text, otherwise: any) => string;
    protected doFirst: (paramTextPairs: ParamTextPair[], defaultText?: Text) => string;
}
