import Persona from "../index";

let max:Persona;

beforeEach(()=> {
  let dogVocab = {
    greet: "{{#choose}}woof|bark|sniff sniff|wag tail{{/choose}}",
    annoy: "{{#choose}}whine=80|howl=12|beg=8{{/choose}}",
    inspect: "snifffff",
    master:
    "{{#params.name}}{{#capitalize}}{{params.name}}{{/capitalize}}{{/params.name}}{{^params.name}}bringer of food{{/params.name}}",
    emoji: "{{#choose}}👅|🐶|🐾|💩|🐩|🐕‍{{/choose}}",
    "welcome-home":
    "{{#capitalize}}{{>greet}}{{/capitalize}}! Welcome home, {{>master}}! {{>emoji}}"
  };
  max = new Persona(dogVocab);
})

test('it can say a concept', () => {
  let value = max.say("inspect");
  expect(value).toEqual("snifffff");
});

test('it will choose from possible options equally when articulating', () => {
  let value = max.say("greet");
  expect(["woof", "bark", "sniff sniff", "wag tail"]).toContain(value);
});

test('it will choose from possible options using weights when articulating', () => {
  let value = max.say("annoy");
  expect(["whine", "howl", "beg"]).toContain(value);
});

test('it will use param when provided', () => {
  let value = max.say("master", { name: "justin" });
  expect(value).toBe("Justin");
});

test('it will use defaults when no constructor params are provided', () => {
  let value = new Persona().say("hello");
  expect(value).toBe("");
});

test('it will use a default empty core when only constructor vocabs are provided', () => {
  let value = new Persona({"hello": "hi there"}).say("hello");
  expect(value).toBe("hi there");
});

test('it will use default vocab when only a core is provided', () => {
  let value = new Persona(undefined, {"hi": "hello"}).say("hello");
  expect(value).toBe("");
});
