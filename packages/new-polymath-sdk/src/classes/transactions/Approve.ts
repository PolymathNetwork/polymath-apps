import BigNumber from 'bignumber.js';
import { Wallet } from '~/classes';
import { PolymathContext } from '~/types';
import { types } from '@polymathnetwork/new-shared';

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

export class Approve {
  public transactions: any[] = [];
  private args: Args;
  private polymath: PolymathContext['polymath'];

  constructor(args: Args, context: PolymathContext) {
    this.args = args;
    this.polymath = context.polymath;
  }

  public async getExecutionPlan() {
    const { amount, spender } = this.args;
    const transactions: TransactionPlan[] = [];

    const allowance = await this.polymath.currentWallet.getAllowance(spender);

    if (allowance.gte(amount)) {
      return transactions;
    }

    const balance = await this.polymath.currentWallet.getBalance(
      types.Tokens.Poly
    );

    if (balance.gte(amount)) {
      this.addTransaction(this.polymath.polyToken.approve)(spender, amount);
      return;
    }

    // NOTE: Alternatively we could check for `getTokens` method

    if (this.polymath.isTestnet) {
      this.addTransaction(this.polymath.polyToken.getTokens)(
        this.polymath.currentWallet,
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
