import { PolymathContext } from '~/types';
import { Contract } from '~/LowLevel/Contract';
import { TransactionBlueprint } from '../TransactionBlueprint';
import { types } from '@polymathnetwork/new-shared';
import { TransactionObject } from 'web3/eth/types';

export type PrimitiveMethod = (...args: any[]) => TransactionObject<any>;

export interface TxConfig {
  args: any[];
  method: PrimitiveMethod;
  contract: Contract<any>;
  from: types.Address;
}

export interface HigherLevelTransaction<Args = any> {
  new (args: Args, context: PolymathContext): TransactionBase<Args>;
}

function isHigherLevelTransaction(
  transaction: any
): transaction is HigherLevelTransaction {
  if (transaction.type) {
    return true;
  }
  return false;
}

export class TransactionBase<P> {
  public static type = 'HLT';
  protected args: P;
  protected context: PolymathContext;
  private transactions: TransactionBlueprint[] = [];
  // TODO @RafaelVidaurre: Temporary for typeguarding

  constructor(args: P, context: PolymathContext) {
    this.args = args;
    this.context = context;
  }

  /**
   * Mandatory method that builds a list of transactions that will be
   * run.
   */
  public async prepareTransactions(): Promise<void> {}

  public async prepare(): Promise<TransactionBlueprint[]> {
    await this.prepareTransactions();
    // NOTE @RafaelVidaurre: Should return some structure with listeners
    // and other public api functionality that might be useful

    // TODO @RafaelVidaurre: add a preparation state cache to avoid repeated
    // transactions and bad validations

    // const wrappedTransactions = this.transactions.map(this.wrapTransaction);

    return this.transactions;
  }

  protected addTransaction(
    Base: HigherLevelTransaction | Contract<any>,
    method?: PrimitiveMethod
  ) {
    return async (...args: any[]) => {
      // If method is a HLT, instanciate it with the right context and args
      if (isHigherLevelTransaction(Base)) {
        const hlt = new Base(args[0], this.context);
        const transactions = await hlt.prepare();
        this.transactions = [...this.transactions, ...transactions];
        return;
      }

      const transaction = new TransactionBlueprint({
        contract: Base,
        method: method as PrimitiveMethod,
        args,
        from: this.context.currentWallet.address,
      });

      this.transactions.push(transaction);
    };
  }
}
