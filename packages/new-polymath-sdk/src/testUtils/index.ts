import Web3PromiEvent from 'web3-core-promievent';
import { GenericContract } from '~/LowLevel/types';
import { PostTransactionResolver } from '~/PostTransactionResolver';

export class MockedContract<T extends GenericContract> {
  public autoResolve: boolean;
  public errorMsg?: string;
  public fakeTxOnePromiEvent = new Web3PromiEvent();
  public fakeTxTwoPromiEvent = new Web3PromiEvent();
  public failureTxPromiEvent = new Web3PromiEvent();

  public fakeTxOne = jest.fn(async () => {
    return () => {
      if (this.autoResolve) {
        this.fakeTxOnePromiEvent.resolve();
      }
      return this.fakeTxOnePromiEvent.eventEmitter;
    };
  });
  public fakeTxTwo = jest.fn(async () => {
    return () => {
      if (this.autoResolve) {
        this.fakeTxTwoPromiEvent.resolve();
      }
      return this.fakeTxTwoPromiEvent.eventEmitter;
    };
  });

  public failureTx = jest.fn(async () => {
    return () => {
      const err = this.errorMsg || 'Test error';
      this.failureTxPromiEvent.reject(new Error(err));
      return this.failureTxPromiEvent.eventEmitter;
    };
  });

  constructor({
    autoResolve = true,
    errorMsg,
  }: { autoResolve?: boolean; errorMsg?: string } = {}) {
    this.autoResolve = autoResolve;
    this.errorMsg = errorMsg;
  }
}

export const getMockTransactionSpec = (
  method: (args: any) => Promise<any>,
  args: any,
  resolver = async () => {}
) => ({
  method,
  args,
  postTransactionResolver: new PostTransactionResolver(resolver),
});
