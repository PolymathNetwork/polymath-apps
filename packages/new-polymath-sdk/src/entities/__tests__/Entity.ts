import { Entity } from '~/entities/Entity';

describe('Entity', () => {
  test('throws if polyClient is not passed', () => {
    expect(() => {
      const st = new Entity();
    }).toThrow();
  });
});
