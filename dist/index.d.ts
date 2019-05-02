interface WeightedVocab {
    t: string;
    w: number;
}
interface ParamValuePair {
    p: string;
    t: any;
}
export default class Persona {
    vocab: any;
    private params;
    private cycledTextsGroups;
    constructor(vocab?: any, params?: any, cycledTextsGroups?: any);
    say: (vocabKey: string, params?: any) => string;
    capitalize: (text: string) => string;
    capSay: (vocabKey: string, params?: any) => string;
    render: (val: any) => string;
    choose: (...texts: (string | WeightedVocab)[]) => string;
    private getCycledTextsFor;
    cycle: (...texts: (string | WeightedVocab)[]) => string;
    maybe: (text: string) => string;
    param: (paramKey: string) => string;
    ifThen: (paramKey: string, then: any) => string;
    ifNot: (paramKey: string, then: any) => string;
    ifElse: (paramKey: string, then: any, otherwise: any) => string;
    doFirst: (paramTextPairs: ParamValuePair[], defaultText?: string) => string;
}
export {};
