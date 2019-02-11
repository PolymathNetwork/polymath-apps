export class PostTransactionResolver<Value extends any> {
  public result?: Value;
  private resolver: () => Promise<Value> | Promise<undefined>;

  constructor(resolver?: () => Promise<Value>) {
    if (!resolver) {
      this.resolver = async () => undefined;
      return;
    }

    this.resolver = resolver;
  }

  public async run() {
    const result = await this.resolver();

    this.result = result;
  }
}
