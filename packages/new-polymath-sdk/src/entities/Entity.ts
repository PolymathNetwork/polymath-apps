import { Polymath } from '~/Polymath';
import { types } from '@polymathnetwork/new-shared';
import v4 from 'uuid/v4';
import { serialize } from '~/utils';

export abstract class Entity {
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

      if (val instanceof Entity) {
        result[prop] = val.toPojo();
      } else if (typeof val !== 'function') {
        result[prop] = val;
      }
    });

    result.uid = this.generateId();

    return result;
  }

  protected generateId() {
    const { entityType } = this;

    return serialize(entityType, {
      random: v4(),
    });
  }
}
