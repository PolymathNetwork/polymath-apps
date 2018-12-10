import { TransactionBase } from './Transaction';
import { PolymathContext } from '~/types';

interface Args {
  symbol: string;
}

export class ReserveSecurityToken extends TransactionBase<Args> {
  public async prepareTransactions(args: Args, context: PolymathContext) {
    const { symbol } = args;
    // const reservationCost = await context.securityTokenRegistry.reservationCost();
  }
}
