import { Procedure } from './Procedure';
import {
  ProcedureTypes,
  PolyTransactionTags,
  ChangeDelegatePermissionArgs,
  ErrorCodes,
  ModuleOperations,
  ModulePermissions,
} from '../types';
import { PolymathError } from '../PolymathError';
import { toChecksumAddress } from '../LowLevel/utils';

export class ChangeDelegatePermission extends Procedure<ChangeDelegatePermissionArgs> {
  public type = ProcedureTypes.ChangeDelegatePermission;

  public async prepareTransactions() {
    const { symbol, op, isGranted, details } = this.args;
    const delegate = toChecksumAddress(this.args.delegate);
    const { securityTokenRegistry } = this.context;
    let module: string;
    let perm: string;

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    if (!securityToken) {
      throw new PolymathError({
        code: ErrorCodes.ProcedureValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    // @TODO remon-nashid refactor into a map(op => {module, perm}).
    switch (op) {
      case ModuleOperations.GTM_WHITELIST_UPDATE:
        perm = ModulePermissions.Whitelist;
        const attachedModule = await securityToken.getGeneralTransferManagerModule();
        if (attachedModule === null) {
          // GTM is supposedly attached to all tokens,x by default. If we reach this line
          // then something very wrong is happening.
          throw new PolymathError({
            code: ErrorCodes.FatalError,
            message:
              "Fatal error: Transfer manager module haven't been enabled. Please report this issue to the Polymath team.",
          });
        }
        module = attachedModule.address;
        break;
      default:
        throw new PolymathError({
          code: ErrorCodes.ProcedureValidationError,
          message: `Unkown operation "${op}"`,
        });
    }

    const permissionModule = await securityToken.getGeneralPermissionManagerModule();
    if (permissionModule === null)
      throw new PolymathError({
        code: ErrorCodes.ProcedureValidationError,
        message: "Permission modules haven't been enabled.",
      });

    const delegates = await permissionModule.getAllDelegates();
    const exists = delegates.filter(element => element === delegate).length > 0;

    // In the following block we attempt to:
    // * Find whether the delegate address is already present. Otherwise add them.
    // * Find whether current delegate permission equals provided one. Otherwise change permissions.
    if (exists) {
      const permittedDelegates: string[] = await permissionModule.getAllDelegatesWithPerm({
        module,
        perm,
      });

      const permitted = permittedDelegates.filter(element => element === delegate).length > 0;
      // Upcoming permission equals existing one.
      if (permitted === isGranted) {
        throw new PolymathError({
          code: ErrorCodes.ProcedureValidationError,
          message: `Delegate\'s permission is already set to ${isGranted}.`,
        });
      }
    } else {
      // Delegate not found. Add them here.
      await this.addTransaction(permissionModule.addDelegate, {
        tag: PolyTransactionTags.ChangeDelegatePermission,
      })({ delegate, details });
    }

    // Change delegate permission
    await this.addTransaction(permissionModule.changePermission, {
      tag: PolyTransactionTags.ChangeDelegatePermission,
    })({ delegate, module, perm, isGranted });
  }
}
