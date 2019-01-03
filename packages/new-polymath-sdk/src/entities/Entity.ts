import { Polymath } from '~/Polymath';

export class Entity {
  protected polyClient: Polymath;

  constructor(polyClient?: Polymath) {
    if (!polyClient) {
      throw new Error(
        'Entity class should always be initialized through the Polymath client'
      );
    }

    this.polyClient = polyClient;
  }
}
