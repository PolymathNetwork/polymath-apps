import BigNumber from 'bignumber.js';
import { types } from '@polymathnetwork/new-shared';
import { Wallet, Polymath } from '~/classes';

/**
 * - Everytime a HLT is run all instances are new. They only exist
 * - on the preparation phase
 */

interface Args {
  amount: BigNumber;
  spender: Wallet;
}

interface TransactionPlan {
  method: (...args: any[]) => Promise<any>;
  args: any[];
}

class Approve {
  public transactions: any[] = [];
  private args: Args;

  constructor(args: Args) {
    this.args = args;
  }

  public async getExecutionPlan() {
    const { amount, spender } = this.args;
    const transactions: TransactionPlan[] = [];

    const allowance = await Polymath.currentWallet.getAllowance(spender);

    // No approval needed
    if (allowance.gte(amount)) {
      return transactions;
    }

    const balance = await Polymath.currentWallet.getBalance(types.Tokens.Poly);

    if (balance.gte(amount)) {
      this.addTransaction(Polymath.polyToken.approve)(spender, amount);
      return;
    }

    // NOTE: Alternatively we could check for `getTokens` method
    if (Polymath.isTestnet) {
      this.addTransaction(Polymath.polyToken.getTokens)(
        Polymath.currentWallet,
        amount
      );
    } else {
      throw new Error('Not enough balance');
    }
  }

  private addTransaction(method: TransactionPlan['method']) {
    return (...args: TransactionPlan['args']) => {
      this.transactions.push({ method, args });
    };
  }
}
