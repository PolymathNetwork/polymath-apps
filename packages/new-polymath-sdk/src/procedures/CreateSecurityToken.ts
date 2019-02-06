import { Procedure } from './Procedure';
import { Approve } from '~/procedures/Approve';
import { types } from '@polymathnetwork/new-shared';
import { CreateSecurityTokenProcedureArgs } from '~/types';

export class CreateSecurityToken extends Procedure<
  CreateSecurityTokenProcedureArgs
> {
  public type = types.ProcedureTypes.CreateSecurityToken;
  public async prepareTransactions() {
    const { name, symbol, detailsUrl = '', divisible } = this.args;
    const { securityTokenRegistry } = this.context;
    const fee = await securityTokenRegistry.getSecurityTokenLaunchFee();

    await this.addTransaction(Approve)({
      amount: fee,
      spender: securityTokenRegistry.address,
    });

    await this.addTransaction(securityTokenRegistry.generateSecurityToken, {
      tag: types.PolyTransactionTags.CreateSecurityToken,
    })({
      tokenName: name,
      ticker: symbol,
      tokenDetails: detailsUrl,
      divisible,
    });
  }
}
