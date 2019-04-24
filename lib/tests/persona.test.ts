import Persona from "../index";

let max:any = null;

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

test('can articulate a concept', () => {
  let value = max.articulate("inspect");
  expect(value).toEqual("snifffff");
  value = max.articulate("{{>inspect}}");
  expect(value).toEqual("snifffff");
});

test('will choose from possible options equally when articulating', () => {
  let value = max.articulate("greet");
  expect(["woof", "bark", "sniff sniff", "wag tail"]).toContain(value);
  value = max.articulate("{{>greet}}");
  expect(["woof", "bark", "sniff sniff", "wag tail"]).toContain(value);
});

test('will choose from possible options using weights when articulating', () => {
  let value = max.articulate("annoy");
  expect(["whine", "howl", "beg"]).toContain(value);
  value = max.articulate("{{>annoy}}");
  expect(["whine", "howl", "beg"]).toContain(value);
});

test('will use param when provided', () => {
  let value = max.articulate("master", { "name": "justin" });
  expect(value).toBe("Justin");
  value = max.articulate("{{>master}}", { "name": "justin" });
  expect(value).toBe("Justin");
});

test('will capitalize strings', () => {
  let value = max.articulate("{{#capitalize}}{{>inspect}}{{/capitalize}}");
  expect(value).toBe("Snifffff");
});

test('will return nothing if partial not found', () => {
  let value = max.articulate("{{>blahhhh}}");
  expect(value).toBe("");
});

test('will return text input if string found in vocab', () => {
  let value = max.articulate("blahhhh");
  expect(value).toBe("blahhhh");
});
