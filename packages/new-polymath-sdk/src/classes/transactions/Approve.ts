import BigNumber from 'bignumber.js';
import { types } from '@polymathnetwork/new-shared';
import { Wallet } from '~/classes';
import { PolymathContext } from '~/types';
import { TransactionBase } from './Transaction';

/**
 * - Everytime a HLT is run all instances are new. They only exist
 * - on the preparation phase
 */

interface Args {
  amount: BigNumber;
  spender: Wallet;
}

export class Approve extends TransactionBase<Args> {
  // FIXME @RafaelVidaurre: Should infer args from base type
  public async prepareTransactions(args: Args, context: PolymathContext) {
    const { amount, spender } = args;
    const allowance = await context.currentWallet.getAllowance(spender);

    if (allowance.gte(args.amount)) {
      return;
    }

    const balance = await context.currentWallet.getBalance(types.Tokens.Poly);

    if (balance.gte(amount)) {
      this.addTransaction(context.polyToken.approve)(spender, amount);
      return;
    }

    if (context.isTestnet) {
      this.addTransaction(context.polyToken.getTokens)(
        context.currentWallet,
        amount
      );
    } else {
      throw new Error('Not enough balance');
    }
  }
}
