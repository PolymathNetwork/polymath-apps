import { TransactionBase } from './Transaction';
import { PolymathContext } from '~/types';

interface Args {
  symbol: string;
  name: string;
}

export class ReserveSecurityToken extends TransactionBase<Args> {
  public async prepareTransactions() {
    const { symbol, name } = this.args;
    //
  }
}
