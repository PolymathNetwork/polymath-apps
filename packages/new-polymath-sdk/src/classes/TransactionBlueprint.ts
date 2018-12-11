import { TxConfig, PrimitiveMethod } from './transactions/Transaction';
import { types } from '@polymathnetwork/new-shared';

export class TransactionBlueprint {
  public method: ReturnType<PrimitiveMethod>;
  public from: types.Address;
  constructor(config: TxConfig) {
    this.method = config.method.bind(config.contract)(...config.args);
    this.from = config.from;
  }

  public async execute() {
    await this.method.send({ from: this.from });
  }
}
