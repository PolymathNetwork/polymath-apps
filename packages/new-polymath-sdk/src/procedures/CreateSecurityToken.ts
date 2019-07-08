import { Procedure } from './Procedure';
import { Approve } from '../procedures/Approve';
import { CreateSecurityTokenProcedureArgs, ProcedureTypes, PolyTransactionTags } from '../types';

export class CreateSecurityToken extends Procedure<CreateSecurityTokenProcedureArgs> {
  public type = ProcedureTypes.CreateSecurityToken;

  public async prepareTransactions() {
    const { name, symbol, detailsUrl = '', divisible } = this.args;
    const { securityTokenRegistry } = this.context;
    const fee = await securityTokenRegistry.getSecurityTokenLaunchFee();

    await this.addTransaction(Approve)({
      amount: fee,
      spender: securityTokenRegistry.address,
    });

    await this.addTransaction(securityTokenRegistry.generateNewSecurityToken, {
      tag: PolyTransactionTags.CreateSecurityToken,
    })({
      tokenName: name,
      ticker: symbol,
      tokenDetails: detailsUrl,
      divisible,
    });
  }
}
