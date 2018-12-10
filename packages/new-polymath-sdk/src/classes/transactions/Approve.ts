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
  spender: types.Address;
}

export class Approve extends TransactionBase<Args> {
  // FIXME @RafaelVidaurre: Should infer args from base type
  public async prepareTransactions() {
    const { amount, spender } = this.args;
    const { currentWallet, polyToken, isTestnet } = this.context;

    const allowance = await currentWallet.getAllowance(spender);

    if (allowance.gte(amount)) {
      return;
    }

    const balance = await currentWallet.getBalance(types.Tokens.Poly);

    if (balance.gte(amount)) {
      this.addTransaction(polyToken.approve)(spender, amount);
      return;
    }

    if (isTestnet) {
      this.addTransaction(polyToken.getTokens)(currentWallet, amount);
    } else {
      throw new Error('Not enough balance');
    }
  }
}
