import { Procedure } from './Procedure';
import { Approve } from './Approve';

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
    console.log('fee', fee);

    await this.addTransaction(Approve)({
      amount: fee,
      spender: securityTokenRegistry.address,
    });

    await this.addTransaction(
      securityTokenRegistry,
      securityTokenRegistry.registerTicker
    )(currentWallet.address, symbol, name);
  }
}
