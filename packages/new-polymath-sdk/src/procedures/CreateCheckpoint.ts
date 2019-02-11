import { Procedure } from './Procedure';
import { types } from '@polymathnetwork/new-shared';
import { CreateCheckpointProcedureArgs } from '~/types';

export class CreateCheckpoint extends Procedure<CreateCheckpointProcedureArgs> {
  public type = types.ProcedureTypes.CreateCheckpoint;
  public async prepareTransactions() {
    const { symbol } = this.args;
    const { securityTokenRegistry } = this.context;

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    await this.addTransaction(securityToken.createCheckpoint, {
      tag: types.PolyTransactionTags.CreateCheckpoint,
    })();
  }
}
