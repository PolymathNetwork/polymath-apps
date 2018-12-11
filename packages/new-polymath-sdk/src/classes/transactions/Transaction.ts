import { TransactionObject } from 'web3/eth/types';
import { Contract } from '~/LowLevel/Contract';
import { TransactionBlueprint } from '~/classes/TransactionBlueprint';
import { TransactionGroup } from '~/classes/TransactionGroup';
import { PolymathContext } from '~/classes/PolymathClient';

export type PrimitiveMethod = (...args: any[]) => TransactionObject<any>;

export interface TxConfig {
  args: any[];
  method: PrimitiveMethod;
  contract: Contract<any>;
  from: string;
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

  public async prepare(): Promise<TransactionGroup> {
    await this.prepareTransactions();

    // TODO @RafaelVidaurre: add a preparation state cache to avoid repeated
    // transactions and bad validations

    return new TransactionGroup(this.transactions);
  }

  protected addTransaction(
    Base: HigherLevelTransaction | Contract<any>,
    method?: PrimitiveMethod
  ) {
    return async (...args: any[]) => {
      // If method is a HLT, instanciate it with the right context and args
      if (isHigherLevelTransaction(Base)) {
        const hlt = new Base(args[0], this.context);
        await hlt.prepareTransactions();
        const transactions = hlt.transactions;
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
