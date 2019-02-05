export class PostTransactionResolver<Value extends any> {
  public result?: Value;
  private resolver: () => Promise<Value>;

  constructor(resolver: () => Promise<Value>) {
    this.resolver = resolver;
  }

  public async run() {
    const result = await this.resolver();

    this.result = result;
  }
}
