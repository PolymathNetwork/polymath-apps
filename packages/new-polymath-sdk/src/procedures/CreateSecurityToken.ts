import { Procedure } from './Procedure';

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

    const securityToken = await securityTokenRegistry.generateSecurityToken(
      name,
      symbol,
      detailsUrl,
      divisible
    );

    await this.addTransaction(securityToken, securityToken.createCheckpoint)();
  }
}
