interface Args {
  address: string;
}

// TODO @RafaelVidaurre: Implement caching strategies and dedupe-ing transactions
export class Wallet {
  public address: string;

  constructor({ address }: Args) {
    this.address = address;
  }

  public toString() {
    return this.address;
  }
}
