import { TestBed, inject } from '@angular/core/testing';

import { Choice } from './choice';

describe('choice', () => {
  it('should be created', () => {
    const choice = new Choice({text: 'success', index: 0});
    expect(choice).toBeTruthy();
  });

  it ('should parse metadata', () => {
    const choice = new Choice({text: 'success (&x==0)', index: 0});
    expect(choice).toBeTruthy();
    expect(choice.metadata.length).toBe(1);
    expect(choice.metadata[0].type === 'requirement');
    expect(choice.text).toBe('success');
  });

  it ('should parse multiple metadata', () => {
    const choice = new Choice({text: 'success ($x>0, &y===0)', index: 0});
    expect(choice).toBeTruthy();
    expect(choice.metadata.length).toBe(2);
    expect(choice.metadata[0].type === 'cost');
    expect(choice.metadata[1].type === 'requirement');
    expect(choice.text).toBe('success');
  });

  it ('should parse metadata with odd spacing', () => {
    const choice = new Choice({text: ' success( $ x >= 0 ,&y===0 ) ', index: 0});
    expect(choice).toBeTruthy();
    expect(choice.metadata.length).toBe(2);
    expect(choice.metadata[0].type === 'cost');
    expect(choice.metadata[1].type === 'requirement');
    expect(choice.text).toBe('success');
  });

  it ('should respect escape character', () => {
    const choice = new Choice({text: 'success \\(truth)', index: 0});
    expect(choice).toBeTruthy();
    expect(choice.metadata.length).toBe(0);
    expect(choice.text).toBe('success (truth)');
  });

  it ('should ignore malformed metadata', () => {
    const choice = new Choice({text: 'success (&x aa!0)', index: 0});
    expect(choice).toBeTruthy();
    expect(choice.metadata.length).toBe(0);
    expect(choice.text).toBe('success');
  });
});
