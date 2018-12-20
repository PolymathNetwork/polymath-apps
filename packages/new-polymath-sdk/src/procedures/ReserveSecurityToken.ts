import { Procedure } from './Procedure';
import { Approve } from './Approve';

interface Argos {
  symbol: string;
  name: string;
}

export class ReserveSecurityToken extends Procedure<Argos> {
  public async prepareTransactions() {
    const { symbol, name } = this.args;
    const { securityTokenRegistry, currentWallet } = this.context;

    const fee = await securityTokenRegistry.getTickerRegistrationFee();

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
