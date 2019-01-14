import Web3PromiEvent from 'web3-core-promievent';
import { GenericContract } from '~/LowLevel/types';
import { PostTransactionResolver } from '~/PostTransactionResolver';

export class MockedContract<T extends GenericContract> {
  public fakeTxOne = jest.fn(async () => {
    return () => {
      const pe = new Web3PromiEvent();
      pe.resolve();
      return pe.eventEmitter;
    };
  });
  public fakeTxTwo = jest.fn(async () => {
    return () => {
      const pe = new Web3PromiEvent();
      pe.resolve();
      return pe.eventEmitter;
    };
  });
}

export const getMockTransactionSpec = (
  method: (...args: any[]) => Promise<any>,
  args: any,
  resolver = async () => {}
) => ({
  method,
  args,
  postTransactionResolver: new PostTransactionResolver(resolver),
});
