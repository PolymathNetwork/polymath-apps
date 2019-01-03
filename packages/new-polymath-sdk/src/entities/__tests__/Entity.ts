import { Entity } from '~/entities/Entity';

describe('Entity', () => {
  test('throws if polyClient is not passed', () => {
    expect(() => {
      class ConcreteEntity extends Entity {
        public entityType = 'concrete';
      }

      const st = new ConcreteEntity();
    }).toThrow();
  });
});
