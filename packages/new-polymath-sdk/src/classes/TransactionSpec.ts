export class TransactionSpec {
  public method;
  public from: string;
  public args: any[];

  constructor(config) {
    this.args = config.args;
    this.method = config.method.bind(config.contract);
    this.from = config.from;
  }

  public async run() {
    await this.method(...this.args);
  }
}
