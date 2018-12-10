import { TransactionBase } from './Transaction';
import { Approve } from './Approve';

interface Args {
  symbol: string;
  name: string;
}

export class ReserveSecurityToken extends TransactionBase<Args> {
  public async prepareTransactions() {
    const { symbol, name } = this.args;
    const { securityTokenRegistry, currentWallet } = this.context;

    const fee = await securityTokenRegistry.getTickerRegistrationFee();

    await this.addTransaction(Approve)({
      amount: fee,
      spender: securityTokenRegistry.address,
    });

    await this.addTransaction(securityTokenRegistry.registerTicker)({
      owner: currentWallet.address,
      symbol,
      name,
    });
  }
}
