import { PluralizePipe } from './pluralize.pipe';

describe('PluralizePipe', () => {
  const pipe = new PluralizePipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should pluralize', () => {
    expect(pipe.transform('bird', '')).toBe('birds');
  });
  it('should not add an extra s', () => {
    expect(pipe.transform('birds', '')).toBe('birds');
  });
});
