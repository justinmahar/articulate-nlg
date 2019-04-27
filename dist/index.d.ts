export default class Persona {
    vocab: Object;
    core: Object;
    constructor(vocab?: Object, core?: Object);
    articulate: (template: string, params?: {}) => string;
}
interface WeightedVocab {
    v: string;
    w: number;
}
export declare class VocabHelpers {
    static capitalize: (text: string) => string;
    static choose: (texts: (string | WeightedVocab)[]) => string;
}
export {};
