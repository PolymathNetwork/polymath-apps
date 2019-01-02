import { TxConfig, PrimitiveMethod } from './transactions/Transaction';

export class TransactionBlueprint {
  public method: PrimitiveMethod;
  public from: string;
  public args: any[];

  constructor(config: TxConfig) {
    this.args = config.args;
    this.method = config.method.bind(config.contract);
    this.from = config.from;
  }

  public async run() {
    await this.method(...this.args);
  }
}
