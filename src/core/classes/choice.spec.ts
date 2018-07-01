import { TestBed, inject } from '@angular/core/testing';

import { Choice } from './choice';

describe('choice', () => {
  it("should be created", () => {
    let simpleChoice = new Choice({text: "TEST", index: 0});
    expect(simpleChoice).toBeTruthy();
  });

  it ("should parse metadata", () => {
    let choiceWithMetadata = new Choice({text: "test (&x==0)", index: 0});
    expect(choiceWithMetadata).toBeTruthy();
    expect(choiceWithMetadata.metadata.length).toBe(1);
    expect(choiceWithMetadata.metadata[0].type === "requirement");
    expect(choiceWithMetadata.text).toBe("test");

    let choiceWithMetadata2 = new Choice({text: "test( & x  >= 0 )", index: 0});
    expect(choiceWithMetadata2).toBeTruthy();
    expect(choiceWithMetadata2.metadata.length).toBe(1);
    expect(choiceWithMetadata2.metadata[0].type === "requirement");
    expect(choiceWithMetadata2.text).toBe("test");
  });
});
