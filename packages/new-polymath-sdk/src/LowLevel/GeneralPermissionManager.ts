import { TransactionObject } from 'web3/eth/types';
import { GeneralPermissionManagerAbi } from './abis/GeneralPermissionManagerAbi';
import { Contract } from './Contract';
import { Context } from './LowLevel';
import { isAddress, getOptions, fromAscii } from './utils';

import {
  GenericContract,
  AddDelegateArgs,
  ChangePermissionArgs,
  GetAllDelegatesWithPermArgs,
} from './types';
import { PolymathError } from '../PolymathError';
import { ErrorCodes } from '../types';

interface GeneralPermissionManagerContract extends GenericContract {
  methods: {
    addDelegate: (delegate: string, details: string) => TransactionObject<void>;
    changePermission: (
      delegate: string,
      module: string,
      perm: string,
      valid: boolean
    ) => TransactionObject<void>;
    getAllDelegates: () => TransactionObject<string[]>;
    getAllDelegatesWithPerm: (module: string, perm: string) => TransactionObject<string[]>;
  };
}

export class GeneralPermissionManager extends Contract<GeneralPermissionManagerContract> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({
      address,
      abi: GeneralPermissionManagerAbi.abi,
      context,
    });
  }

  public getAllDelegates = async () => {
    return await this.contract.methods.getAllDelegates().call();
  };

  public getAllDelegatesWithPerm = async ({ module, perm }: GetAllDelegatesWithPermArgs) => {
    return await this.contract.methods.getAllDelegatesWithPerm(module, perm).call();
  };

  public addDelegate = async ({ delegate, details = '' }: AddDelegateArgs) => {
    if (!isAddress(delegate))
      throw new PolymathError({
        code: ErrorCodes.InvalidAddress,
        message: `Delegate address is invalid: $delegate = ${delegate}`,
      });

    const method = this.contract.methods.addDelegate(delegate, fromAscii(details));
    const options = await getOptions(method, { from: this.context.account });
    return () => method.send(options);
  };

  public changePermission = async ({ delegate, module, perm, isGranted }: ChangePermissionArgs) => {
    if (!isAddress(delegate))
      throw new PolymathError({
        code: ErrorCodes.InvalidAddress,
        message: `Delegate address is invalid: $delegate = ${delegate}`,
      });

    const method = this.contract.methods.changePermission(
      delegate,
      module,
      fromAscii(perm),
      isGranted
    );
    const options = await getOptions(method, { from: this.context.account });
    return () => method.send(options);
  };
}
