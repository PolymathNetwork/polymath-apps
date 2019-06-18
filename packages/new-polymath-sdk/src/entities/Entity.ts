import { Polymath } from '../Polymath';

export abstract class Entity {
  public abstract uid: string;
  protected polyClient: Polymath;

  constructor(polyClient?: Polymath, requiresPolyClient = true) {
    if (requiresPolyClient && !polyClient) {
      throw new Error(
        'Entity class should always be initialized through the Polymath client'
      );
    }

    // Force typing to simplify external usage
    this.polyClient = polyClient as Polymath;
  }

  public abstract toPojo(): any;
}
