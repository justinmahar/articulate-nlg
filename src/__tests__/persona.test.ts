import Persona, { Vocabulary } from '../index';

class Dog extends Persona {
  createVocab = (): Vocabulary => {
    const say = this.say;
    const capitalize = this.capitalize;
    const sb = this.sb;
    const sa = this.sa;
    const sba = this.sba;
    const capSay = this.capSay;
    const choose = this.choose;
    const weighted = this.weighted;
    const chance = this.chance;
    const cycle = this.cycle;
    const maybe = this.maybe;
    const param = this.param;
    const ifThen = this.ifThen;
    const ifNot = this.ifNot;
    const ifElse = this.ifElse;
    const doFirst = this.doFirst;
    return {
      howl: () => 'howl',
      howlCap: () => capitalize(say('howl')),
      sbHowl: () => sb(say('howl')),
      saHowl: () => sa(say('howl')),
      sbaHowl: () => sba(say('howl')),
      capSayGreet: () => capSay('greet'),
      capSayNameWithParams: () => capSay('paramName', { name: 'Justin' }),
      greet: () => choose('woof', 'bark', 'ruff'),
      greetWeighted: () => choose(weighted('woof', 100000), weighted('bark', 0.00001), weighted('ruff', 0.00001)),
      greetWeightedDefault: () => choose(weighted('woof'), weighted('bark'), weighted('ruff')),
      chanceHowl: () => chance(say('howl'), 0.8),
      chooseNull: () => choose(weighted('never', 0)),
      cycleGreet: () => cycle({ group: 'greet' }, 'woof', 'bark', 'ruff'),
      maybeGreet: () => maybe(say('greet')),
      maybeDigMultiple: () => maybe('scratch', 'dig', 'burrow'),
      paramName: () => param('name'),
      ifThenAngryHowl: () => ifThen('angry', say('howl')),
      ifNotAngrySniff: () => ifNot('angry', 'sniff'),
      ifElseAngryHowlWagTail: () =>
        ifElse(
          'angry',
          () => say('howl'),
          () => 'wag tail',
        ),
      doFirstAngryHowlHappyWagTail: () =>
        doFirst([
          { p: 'angry', t: say('howl') },
          { p: 'happy', t: 'wag tail' },
        ]),
      doFirstAngryHowlHappyWagTailElseWhine: () =>
        doFirst(
          [
            { p: 'angry', t: () => say('howl') },
            { p: 'happy', t: () => 'wag tail' },
          ],
          'whine',
        ),
      paramNumber: () => param('number'),
      weightedWoof: () => weighted('woof', 100),
      greetDeferred: () =>
        choose(
          () => 'woof',
          () => 'bark',
          () => 'ruff',
        ),
    };
  };

  vocab = this.createVocab();
}

let max = new Dog();
beforeEach(() => {
  max = new Dog();
});

test('it can articulate concepts', () => {
  expect(max.articulate('howl')).toEqual('howl');
});

test('it can capitalize text', () => {
  expect(max.articulate('howlCap')).toEqual('Howl');
});

test('it can add a space before text', () => {
  expect(max.articulate('sbHowl')).toEqual(' howl');
});

test('it can add a space after text', () => {
  expect(max.articulate('saHowl')).toEqual('howl ');
});

test('it can add a space before and after text in one step', () => {
  expect(max.articulate('sbaHowl')).toEqual(' howl ');
});

test('it can choose an item randomly', () => {
  expect(['woof', 'bark', 'ruff']).toContain(max.articulate('greet'));
});

test('it can choose an item randomly with weighted defaults', () => {
  expect(['woof', 'bark', 'ruff']).toContain(max.articulate('greetWeightedDefault'));
});

test('it can choose an item randomly with some being weighted differently', () => {
  expect(['woof']).toContain(max.articulate('greetWeighted'));
});

test('it can handle null when choosing an item randomly', () => {
  expect('').toEqual(max.articulate('chooseNull'));
});

test('it can say and capitalize text in one step', () => {
  Array.from({ length: 10 }).forEach(() => {
    expect(['Woof', 'Bark', 'Ruff']).toContain(max.articulate('capSayGreet'));
  });
});

test('it can generate text based on a chance probability', () => {
  Array.from({ length: 10 }).forEach(() => {
    expect(['howl', '']).toContain(max.articulate('chanceHowl'));
  });
});

test('it can randomly cycle through text, preventing repeats until all options are exhausted', () => {
  Array.from({ length: 10 }).forEach(() => {
    // Possible values: "woof", "bark", "ruff"
    let cycledValues: string[] = [];
    let nextVal = max.articulate('cycleGreet');
    //console.log("chose '", nextVal);
    expect(['woof', 'bark', 'ruff']).toContain(nextVal);
    cycledValues.push(nextVal);
    //console.log("All so far: ", cycledValues);
    // possible values: 2 of 3
    nextVal = max.articulate('cycleGreet');
    //console.log("chose '", nextVal);
    expect(cycledValues).not.toContain(nextVal);
    cycledValues.push(nextVal);
    //console.log("All so far: ", cycledValues);
    // possible values: 1 of 3
    nextVal = max.articulate('cycleGreet');
    //console.log("chose '", nextVal);
    expect(cycledValues).not.toContain(nextVal);
    cycledValues.push(nextVal);
    //console.log("All so far: ", cycledValues);
    // Starting over. Possible values: "woof", "bark", "ruff"
    cycledValues = [];
    //console.log("Cleared:", cycledValues);
    nextVal = max.articulate('cycleGreet');
    //console.log("chose '", nextVal);
    expect(['woof', 'bark', 'ruff']).toContain(nextVal);
    cycledValues.push(nextVal);
    //console.log("All so far: ", cycledValues);
    // possible values: 2 of 3
    nextVal = max.articulate('cycleGreet');
    expect(cycledValues).not.toContain(nextVal);
    cycledValues.push(nextVal);
    // possible values: 1 of 3
    nextVal = max.articulate('cycleGreet');
    expect(cycledValues).not.toContain(nextVal);
  });
});

test('it can "maybe" output text, giving it a 50/50 chance empty string or the text provided', () => {
  Array.from({ length: 10 }).forEach(() => {
    expect(['woof', 'bark', 'ruff', '']).toContain(max.articulate('maybeGreet'));
  });
});

test('it can "maybe" output text, giving it a 50/50 chance empty string or one of the texts provided', () => {
  Array.from({ length: 10 }).forEach(() => {
    expect(['scratch', 'dig', 'burrow', '']).toContain(max.articulate('maybeDigMultiple'));
  });
});

test('it can use the text of a provided parameter as a string', () => {
  const result = max.articulate('paramName', { name: 'Justin' });
  expect(result).toEqual('Justin');
});

test('it uses empty string when a param string is not found', () => {
  const result = max.articulate('paramName', { blahblah: 'nonsense' });
  expect(result).toEqual('');
});

test('it calls the function when a param is a function', () => {
  const result = max.articulate('paramName', { name: () => 'Justin' });
  expect(result).toEqual('Justin');
});

test('it will use if-then to render text if a param is truthy', () => {
  let result = max.articulate('ifThenAngryHowl', { angry: true });
  expect(result).toEqual('howl');
  result = max.articulate('ifThenAngryHowl', { angry: false });
  expect(result).toEqual('');
});

test('it will use if-not to render text if a param is falsy', () => {
  let result = max.articulate('ifNotAngrySniff', { angry: false });
  expect(result).toEqual('sniff');
  result = max.articulate('ifNotAngrySniff', { angry: true });
  expect(result).toEqual('');
});

test('it will use if-else to render text if a param is truthy and text if param is falsy', () => {
  let result = max.articulate('ifElseAngryHowlWagTail', { angry: true });
  expect(result).toEqual('howl');
  result = max.articulate('ifElseAngryHowlWagTail', { angry: false });
  expect(result).toEqual('wag tail');
});

test('it will use text for the first param that is truthy and empty string if none are truthy', () => {
  let result = max.articulate('doFirstAngryHowlHappyWagTail', {
    angry: true,
    happy: false,
  });
  expect(result).toEqual('howl');
  result = max.articulate('doFirstAngryHowlHappyWagTail', { angry: true });
  expect(result).toEqual('howl');
  result = max.articulate('doFirstAngryHowlHappyWagTail', {
    angry: false,
    happy: true,
  });
  expect(result).toEqual('wag tail');
  result = max.articulate('doFirstAngryHowlHappyWagTail', { happy: true });
  expect(result).toEqual('wag tail');
  result = max.articulate('doFirstAngryHowlHappyWagTail');
  expect(result).toEqual('');
});

test('it will use text for the first param that is truthy and the provided string if none are truthy', () => {
  let result = max.articulate('doFirstAngryHowlHappyWagTailElseWhine', {
    angry: true,
    happy: false,
  });
  expect(result).toEqual('howl');
  result = max.articulate('doFirstAngryHowlHappyWagTailElseWhine', {
    angry: true,
  });
  expect(result).toEqual('howl');
  result = max.articulate('doFirstAngryHowlHappyWagTailElseWhine', {
    angry: false,
    happy: true,
  });
  expect(result).toEqual('wag tail');
  result = max.articulate('doFirstAngryHowlHappyWagTailElseWhine', {
    happy: true,
  });
  expect(result).toEqual('wag tail');
  result = max.articulate('doFirstAngryHowlHappyWagTailElseWhine', {
    angry: false,
    happy: false,
  });
  expect(result).toEqual('whine');
  result = max.articulate('doFirstAngryHowlHappyWagTailElseWhine');
  expect(result).toEqual('whine');
});

test('it will return an empty string if a concept is not found', () => {
  const result = max.articulate('this-key-is-supposed-to-be-missing');
  expect(result).toEqual('');
});

test('it will render non-string, non-function params as strings', () => {
  const result = max.articulate('paramNumber', { number: 12345 });
  expect(result).toEqual('12345');
});

test('it will accept and use params when calling capSay', () => {
  const result = max.articulate('capSayNameWithParams', { name: 'justin' });
  expect(result).toEqual('Justin');
});

test('it can handle rendering weighted text', () => {
  const result = max.articulate('weightedWoof');
  expect(result).toEqual('woof');
});

test('it can handle deferred rendering for choose', () => {
  const result = max.articulate('greetDeferred');
  expect(['woof', 'bark', 'ruff']).toContain(result);
});
