import { TxStepConfig } from './transactions/Transaction';

export class TransactionStep {
  private config: TxStepConfig;

  constructor(config: TxStepConfig) {
    this.config = config;
  }

  /**
   * Sends the transaction to the blockchain
   */
  public send() {
    this.config.method(this.config.args);
  }
}
