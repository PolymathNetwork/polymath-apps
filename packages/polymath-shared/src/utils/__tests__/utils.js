import { normalizeURL } from '../index';

describe('function: normalizeURL', () => {
  test('returns the provided URL without a trailing slash', () => {
    expect(normalizeURL('http://some.url/')).toBe('http://some.url');
  });

  test("returns the provided URL as is if it doesn't have a trailing slash", () => {
    const expectedURL = 'http://some.url';
    expect(normalizeURL(expectedURL)).toBe(expectedURL);
  });
});
