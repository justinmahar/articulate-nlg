export default class Persona {
    vocab: Object;
    core: Object;
    constructor(vocab?: Object, core?: Object);
    say: (template: string, params?: {}) => string;
}
interface WeightedVocab {
    v: string;
    w: number;
}
interface ParamTextPair {
    p: string;
    t: string;
}
export declare class VocabHelpers {
    static capitalize: (text: string) => string;
    static choose: (texts: (string | WeightedVocab)[]) => string;
    static maybe: (text: string) => string;
    static say: (vocabKey: string) => string;
    static param: (paramKey: string) => string;
    static ifThen: (paramKey: string, thenText: string) => string;
    static ifNot: (paramKey: string, thenText: string) => string;
    static ifElse: (paramKey: string, thenText: string, elseText: string) => string;
    static doFirst: (paramTextPairs: ParamTextPair[], defaultText?: string) => string;
}
export {};
