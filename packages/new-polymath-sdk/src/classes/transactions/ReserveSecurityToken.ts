import { TransactionBase } from './Transaction';
import { Approve } from './Approve';

interface Args {
  symbol: string;
  name: string;
}

export class ReserveSecurityToken extends TransactionBase<Args> {
  public async prepareTransactions() {
    const { symbol, name } = this.args;
    const { securityTokenRegistry } = this.context;
    // 1. Get fee required
    // 2. Approve amount
    // 3. Execute transaction

    const fee = await securityTokenRegistry.getTickerRegistrationFee();

    this.addTransaction(Approve)({
      amount: fee,
      spender: securityTokenRegistry.address,
    });
  }
}
