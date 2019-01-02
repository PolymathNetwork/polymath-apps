import { Polymath } from '~/Polymath';

export abstract class Entity {
  protected polyClient: Polymath;

  constructor(polyClient?: Polymath) {
    if (!polyClient) {
      throw new Error(
        'SecurityToken entity class should always be initialized through the Polymath client'
      );
    }

    this.polyClient = polyClient;
  }
}
