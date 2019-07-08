import { GeneralTransferManagerAbi } from './abis/GeneralTransferManagerAbi';
import { Contract } from './Contract';
import { Context } from './LowLevel';

import { GenericContract } from './types';

interface GeneralTransferManagerContract extends GenericContract {
  methods: {};
}

export class GeneralTransferManager extends Contract<GeneralTransferManagerContract> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({
      address,
      abi: GeneralTransferManagerAbi.abi,
      context,
    });
  }
}
