import { Procedure } from './Procedure';
import { Approve } from './Approve';
import { types } from '@polymathnetwork/new-shared';

export interface Args {
  symbol: string;
  name: string;
}

export class ReserveSecurityToken extends Procedure<Args> {
  public type = types.ProcedureTypes.ReserveSecurityToken;
  public async prepareTransactions() {
    const { symbol, name } = this.args;
    const { securityTokenRegistry, currentWallet } = this.context;

    // TODO @RafaelVidaurre: See if ticker is not already registered

    const fee = await securityTokenRegistry.getTickerRegistrationFee();

    await this.addTransaction(Approve)({
      amount: fee,
      spender: securityTokenRegistry.address,
    });

    await this.addTransaction(securityTokenRegistry.registerTicker, {
      tag: types.PolyTransactionTags.ReserveSecurityToken,
    })(currentWallet.address, symbol, name);
  }
}
