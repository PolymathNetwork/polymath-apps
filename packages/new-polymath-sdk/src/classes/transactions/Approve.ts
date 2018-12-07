import BigNumber from 'bignumber.js';
import { types } from '@polymathnetwork/new-shared';
import { Wallet } from '~/classes/Wallet';

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
  spender: Wallet;
  sender: Wallet;
}

class Approve {
  public transactions: any[] = [];
  private context: Context;
  private args: Args;

  constructor(context: Context, args: Args) {
    this.context = context;
    this.args = args;
  }

  public async getExecutionPlan() {
    const { isTestnet } = this.context;
    const { sender, amount, spender } = this.args;
    const transactions = [];

    const allowance = await spender.getAllowance(sender);
    // const balance = await sender.getBalance(types.Tokens.Poly);

    // if (allowance) {
    //   if (isTestnet) {
    //     // transactions.push(PolyToken.getTokens());
    //   }
    // }
    /**
     * 1. get balance
     * 2. get allowance
     */
  }
}
