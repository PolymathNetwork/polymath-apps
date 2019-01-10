import { Procedure } from './Procedure';
import { Approve } from './Approve';
import { PolyTransactionTags } from '~/types';

interface Args {
  symbol: string;
  name: string;
}

export class ReserveSecurityToken extends Procedure<Args> {
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
      tag: PolyTransactionTags.ReserveSecurityToken,
    })(currentWallet.address, symbol, name);
  }
}
