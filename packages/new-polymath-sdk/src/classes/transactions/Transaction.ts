import BigNumber from 'bignumber.js';
import { types } from '@polymathnetwork/new-shared';
import { PrimitiveTransaction } from './PrimitiveTransaction';

/**
 * - needs wallet
 * - needs wallet's balance
 * - calls approve primitive if required
 *
 */

interface Context {
  isTestnet: boolean;
}
interface Args {
  amount: BigNumber;
  spender: types.Address;
  sender: types.Address;
  balance: BigNumber;
}

class Approve {
  public transactions: PrimitiveTransaction[] = [];
  private context: Context;
  private args: Args;

  constructor(context: Context, args: Args) {
    this.context = context;
    this.args = args;
  }

  public getExecutionPlan() {
    const { isTestnet } = this.context;
    const { amount, balance } = this.args;
    const transactions = [];
    const hasEnoughBalance = balance.lt(amount);

    if (hasEnoughBalance) {
      if (isTestnet) {
        // transactions.push(PolyToken.getTokens());
      }
    }
    /**
     * 1. get balance
     * 2. get allowance
     */
  }
}
