import { TransactionBase } from './Transaction';

interface Args {
  symbol: string;
}

export class CreateCheckpoint extends TransactionBase<Args> {
  public async prepareTransactions() {
    const { symbol } = this.args;
    const { securityTokenRegistry } = this.context;

    const securityToken = await securityTokenRegistry.getSecurityToken(symbol);

    await this.addTransaction(securityToken, securityToken.createCheckpoint)();
  }
}
