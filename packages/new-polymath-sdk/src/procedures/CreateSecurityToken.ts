import { Procedure } from './Procedure';
import { Approve } from '~/procedures/Approve';
import { PolyTransactionTags } from '~/types';

interface Args {
  name: string;
  symbol: string;
  detailsUrl?: string;
  divisible: boolean;
}

export class CreateSecurityToken extends Procedure<Args> {
  public async prepareTransactions() {
    const { name, symbol, detailsUrl = '', divisible } = this.args;
    const { securityTokenRegistry } = this.context;
    const fee = await securityTokenRegistry.getSecurityTokenLaunchFee();

    await this.addTransaction(Approve)({
      amount: fee,
      spender: securityTokenRegistry.address,
    });

    await this.addTransaction(securityTokenRegistry.generateSecurityToken, {
      tag: PolyTransactionTags.CreateSecurityToken,
    })(name, symbol, detailsUrl, divisible);
  }
}
