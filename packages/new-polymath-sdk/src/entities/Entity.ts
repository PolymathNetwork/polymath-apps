import { Polymath } from '~/Polymath';
import { types } from '@polymathnetwork/new-shared';
import v4 from 'uuid/v4';
import { serialize } from '~/utils';

export abstract class Entity {
  private static unwrap(value: any): any {
    if (value instanceof Entity) {
      return value.toPojo();
    } else if (Array.isArray(value)) {
      return value.map(Entity.unwrap).filter(val => !!val);
    } else if (typeof value !== 'function') {
      return value;
    }
  }

  public abstract entityType: string;
  public uid: string;
  protected polyClient: Polymath;

  constructor(polyClient?: Polymath) {
    if (!polyClient) {
      throw new Error(
        'Entity class should always be initialized through the Polymath client'
      );
    }

    this.polyClient = polyClient;
    this.uid = this.generateId();
  }

  public toPojo(): types.Pojo {
    const publicProps = Object.getOwnPropertyNames(this);

    const result: types.Pojo = {};

    publicProps.forEach(prop => {
      const val = (this as any)[prop];

      const unwrappedVal = Entity.unwrap(val);

      if (unwrappedVal) {
        result[prop] = unwrappedVal;
      }
    });

    return result;
  }

  protected generateId() {
    const { entityType } = this;

    return serialize(entityType, {
      random: v4(),
    });
  }
}
