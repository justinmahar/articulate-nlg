export default class Persona {
    vocab: Object;
    core: Object;
    constructor(vocab?: Object, core?: Object);
    articulate: (template: string, params?: {}) => string;
}
