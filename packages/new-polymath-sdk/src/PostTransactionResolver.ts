export class PostTransactionResolver<Value extends any> extends Promise<Value> {
  public result?: Value;
  private resolve?: (value?: any) => void;
  private reject?: (reason?: any) => void;
  private resolver: () => Promise<Value>;

  constructor(resolver: () => Promise<Value>) {
    super((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.resolver = resolver;
  }

  public async run() {
    let result: Value;
    if (!this.resolve || !this.reject) {
      throw new Error('Assertion error');
    }

    try {
      result = await this.resolver();
    } catch (error) {
      this.reject(error);
      return;
    }

    this.resolve(result);
    this.result = result;
  }
}
