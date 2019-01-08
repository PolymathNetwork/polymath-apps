import _ from 'lodash';
import { Contract } from '~/LowLevel/Contract';
import { GenericContract } from '~/LowLevel/types';

export abstract class MockedContract<
  T extends GenericContract
> extends Contract<T> {
  public methods: any = {};
  constructor(params: any) {
    super(params);

    // Transform all methods into mock functions
    this.methods = _.mapValues(this.methods, method => {
      return jest.fn();
    });
  }
}
