import { Procedure } from './Procedure';
import { types } from '@polymathnetwork/new-shared';

interface Args {
  symbol: string;
}

export class CreateCheckpoint extends Procedure<Args> {
  public type = types.ProcedureTypes.CreateCheckpoint;
  public async prepareTransactions() {
    const { symbol } = this.args;
    const { securityTokenRegistry } = this.context;

    const securityToken = await securityTokenRegistry.getSecurityToken(symbol);

    await this.addTransaction(securityToken.createCheckpoint, {
      tag: types.PolyTransactionTags.CreateCheckpoint,
    })();
  }
}
