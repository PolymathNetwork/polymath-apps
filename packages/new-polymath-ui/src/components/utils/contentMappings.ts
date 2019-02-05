import { types } from '@polymathnetwork/new-shared';
import { SvgErc20 } from '~/images/icons/Erc20';
import { ProcedureArguments, TransactionArguments } from '@polymathnetwork/sdk';

// TODO @monitz87: use actual text. The arguments are already there and typesafe
export const getTransactionQueueTitle = (queue: types.TransactionQueuePojo) => {
  const { status, procedureType } = queue;

  switch (procedureType) {
    case types.ProcedureTypes.Approve: {
      const args: ProcedureArguments[types.ProcedureTypes.Approve] = queue.args;

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return 'An error ocurred while Approving';
        }
        case types.TransactionQueueStatus.Idle: {
          return 'Proceed with Approve';
        }
        case types.TransactionQueueStatus.Running: {
          return 'Proceeding with Approve';
        }
        case types.TransactionQueueStatus.Succeeded: {
          return 'Approve was successfully submitted';
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.CreateCheckpoint: {
      const args: ProcedureArguments[types.ProcedureTypes.CreateCheckpoint] =
        queue.args;

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return 'An error ocurred while Creating Checkpoint';
        }
        case types.TransactionQueueStatus.Idle: {
          return 'Proceed with Create Checkpoint';
        }
        case types.TransactionQueueStatus.Running: {
          return 'Proceeding with Create Checkpoint';
        }
        case types.TransactionQueueStatus.Succeeded: {
          return 'Create Checkpoint was successfully submitted';
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.CreateErc20DividendDistribution: {
      const args: ProcedureArguments[types.ProcedureTypes.CreateErc20DividendDistribution] =
        queue.args;

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return 'An error ocurred while Creating ERC20 Dividend Distribution';
        }
        case types.TransactionQueueStatus.Idle: {
          return 'Proceed with Create ERC20 Dividend Distribution';
        }
        case types.TransactionQueueStatus.Running: {
          return 'Proceeding with Create ERC20 Dividend Distribution';
        }
        case types.TransactionQueueStatus.Succeeded: {
          return 'Create ERC20 Dividend Distribution was successfully submitted';
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.CreateEtherDividendDistribution: {
      const args: ProcedureArguments[types.ProcedureTypes.CreateEtherDividendDistribution] =
        queue.args;

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return 'An error ocurred while Creating ETH Dividend Distribution';
        }
        case types.TransactionQueueStatus.Idle: {
          return 'Proceed with Create ETH Dividend Distribution';
        }
        case types.TransactionQueueStatus.Running: {
          return 'Proceeding with Create ETH Dividend Distribution';
        }
        case types.TransactionQueueStatus.Succeeded: {
          return 'Create ETH Dividend Distribution was successfully submitted';
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.CreateSecurityToken: {
      const args: ProcedureArguments[types.ProcedureTypes.CreateSecurityToken] =
        queue.args;

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return 'An error ocurred while Creating Security Token';
        }
        case types.TransactionQueueStatus.Idle: {
          return 'Proceed with Create Security Token';
        }
        case types.TransactionQueueStatus.Running: {
          return 'Proceeding with Create Security Token';
        }
        case types.TransactionQueueStatus.Succeeded: {
          return 'Create Security Token was successfully submitted';
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.EnableDividendModules: {
      const args: ProcedureArguments[types.ProcedureTypes.EnableDividendModules] =
        queue.args;

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return 'An error ocurred while Enabling Dividend Modules';
        }
        case types.TransactionQueueStatus.Idle: {
          return 'Proceed with Enable Dividend Modules';
        }
        case types.TransactionQueueStatus.Running: {
          return 'Proceeding with Enable Dividend Modules';
        }
        case types.TransactionQueueStatus.Succeeded: {
          return 'Enable Dividend Modules was successfully submitted';
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.ReclaimFunds: {
      const args: ProcedureArguments[types.ProcedureTypes.ReclaimFunds] =
        queue.args;

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return 'An error ocurred while Reclaiming Funds';
        }
        case types.TransactionQueueStatus.Idle: {
          return 'Proceed with Reclaim Funds';
        }
        case types.TransactionQueueStatus.Running: {
          return 'Proceeding with Reclaim Funds';
        }
        case types.TransactionQueueStatus.Succeeded: {
          return 'Reclaim Funds was successfully submitted';
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.ReserveSecurityToken: {
      const args: ProcedureArguments[types.ProcedureTypes.ReserveSecurityToken] =
        queue.args;

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return 'An error ocurred while Reserving Security Token';
        }
        case types.TransactionQueueStatus.Idle: {
          return 'Proceed with Reserve Security Token';
        }
        case types.TransactionQueueStatus.Running: {
          return 'Proceeding with Reserve Security Token';
        }
        case types.TransactionQueueStatus.Succeeded: {
          return 'Reserve Security Token was successfully submitted';
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.WithdrawTaxes: {
      const args: ProcedureArguments[types.ProcedureTypes.WithdrawTaxes] =
        queue.args;

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return 'An error ocurred while Withdrawing Funds';
        }
        case types.TransactionQueueStatus.Idle: {
          return 'Proceed with Withdraw Funds';
        }
        case types.TransactionQueueStatus.Running: {
          return 'Proceeding with Withdraw Funds';
        }
        case types.TransactionQueueStatus.Succeeded: {
          return 'Withdraw Funds was successfully submitted';
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.UnnamedProcedure:
    default: {
      return 'Unnamed Procedure';
    }
  }
};

// TODO @monitz87: use actual text. The arguments are already there and typesafe
export const getTransactionQueueContent = (
  queue: types.TransactionQueuePojo
) => {
  const { procedureType } = queue;

  switch (procedureType) {
    case types.ProcedureTypes.Approve: {
      const args: ProcedureArguments[types.ProcedureTypes.Approve] = queue.args;

      return {
        title: 'Approve',
        description: 'Approve',
      };
    }
    case types.ProcedureTypes.CreateCheckpoint: {
      const args: ProcedureArguments[types.ProcedureTypes.CreateCheckpoint] =
        queue.args;

      return {
        title: 'Create Checkpoint',
        description: 'Create Checkpoint',
      };
    }
    case types.ProcedureTypes.CreateErc20DividendDistribution: {
      const args: ProcedureArguments[types.ProcedureTypes.CreateErc20DividendDistribution] =
        queue.args;

      return {
        title: 'Create ERC20 Dividend Distribution',
        description: 'Create ERC20 Dividend Distribution',
      };
    }
    case types.ProcedureTypes.CreateEtherDividendDistribution: {
      const args: ProcedureArguments[types.ProcedureTypes.CreateEtherDividendDistribution] =
        queue.args;

      return {
        title: 'Create ETH Dividend Distribution',
        description: 'Create ETH Dividend Distribution',
      };
    }
    case types.ProcedureTypes.CreateSecurityToken: {
      const args: ProcedureArguments[types.ProcedureTypes.CreateSecurityToken] =
        queue.args;

      return {
        title: 'Create Security Token',
        description: 'Create Security Token',
      };
    }
    case types.ProcedureTypes.EnableDividendModules: {
      const args: ProcedureArguments[types.ProcedureTypes.EnableDividendModules] =
        queue.args;

      return {
        title: 'Enable Dividend Modules',
        description: 'Enable Dividend Modules',
      };
    }
    case types.ProcedureTypes.ReclaimFunds: {
      const args: ProcedureArguments[types.ProcedureTypes.ReclaimFunds] =
        queue.args;

      return {
        title: 'Reclaim Funds',
        description: 'Reclaim Funds',
      };
    }
    case types.ProcedureTypes.ReserveSecurityToken: {
      const args: ProcedureArguments[types.ProcedureTypes.ReserveSecurityToken] =
        queue.args;

      return {
        title: 'Reserve Security Token',
        description: 'Reserve Security Token',
      };
    }
    case types.ProcedureTypes.WithdrawTaxes: {
      const args: ProcedureArguments[types.ProcedureTypes.WithdrawTaxes] =
        queue.args;

      return {
        title: 'Withdraw Taxes',
        description: 'Withdraw Taxes',
      };
    }
    case types.ProcedureTypes.UnnamedProcedure:
    default: {
      return {
        title: 'Unnamed Procedure',
        description: 'Unnamed Procedure',
      };
    }
  }
};

// TODO @monitz87: use actual text. The arguments are already there and typesafe
export const getTransactionTitle = (transaction: types.TransactionPojo) => {
  const { tag } = transaction;

  switch (tag) {
    case types.PolyTransactionTags.Any: {
      return 'Unnamed Transaction';
    }
    case types.PolyTransactionTags.Approve: {
      const args: TransactionArguments[types.PolyTransactionTags.Approve] =
        transaction.args;

      return 'Approve';
    }
    case types.PolyTransactionTags.CreateCheckpoint: {
      const args: TransactionArguments[types.PolyTransactionTags.CreateCheckpoint] =
        transaction.args;

      return 'Create Checkpoint';
    }
    case types.PolyTransactionTags.CreateErc20DividendDistribution: {
      const args: TransactionArguments[types.PolyTransactionTags.CreateErc20DividendDistribution] =
        transaction.args;

      return 'Create Erc20 Dividend Distribution';
    }
    case types.PolyTransactionTags.CreateSecurityToken: {
      const args: TransactionArguments[types.PolyTransactionTags.CreateSecurityToken] =
        transaction.args;

      return 'Create Security Token';
    }
    case types.PolyTransactionTags.EnableDividends: {
      const args: TransactionArguments[types.PolyTransactionTags.EnableDividends] =
        transaction.args;

      return 'Enable Dividends';
    }
    case types.PolyTransactionTags.GetTokens: {
      const args: TransactionArguments[types.PolyTransactionTags.GetTokens] =
        transaction.args;

      return 'Get Tokens';
    }
    case types.PolyTransactionTags.ReclaimDividendFunds: {
      const args: TransactionArguments[types.PolyTransactionTags.ReclaimDividendFunds] =
        transaction.args;

      return 'Reclaim Dividend Funds';
    }
    case types.PolyTransactionTags.ReserveSecurityToken: {
      const args: TransactionArguments[types.PolyTransactionTags.ReserveSecurityToken] =
        transaction.args;

      return 'Reserve Security Token';
    }
    case types.PolyTransactionTags.SetErc20TaxWithholding: {
      const args: TransactionArguments[types.PolyTransactionTags.SetErc20TaxWithholding] =
        transaction.args;

      return 'Set ERC20 Tax Withholding';
    }
    case types.PolyTransactionTags.SetEtherTaxWithholding: {
      const args: TransactionArguments[types.PolyTransactionTags.SetEtherTaxWithholding] =
        transaction.args;

      return 'Set ETH tax Withholding';
    }
    case types.PolyTransactionTags.WithdrawTaxWithholdings: {
      const args: TransactionArguments[types.PolyTransactionTags.WithdrawTaxWithholdings] =
        transaction.args;

      return 'Withdraw Tax Withholdings';
    }
    default: {
      return '';
    }
  }
};

// TODO @monitz87: use actual text. The arguments are already there and typesafe
export const getTransactionContent = (transaction: types.TransactionPojo) => {
  const { tag } = transaction;

  switch (tag) {
    case types.PolyTransactionTags.Any: {
      return {
        title: 'Unnamed Transaction',
        description: 'Unnamed Transaction',
      };
    }
    case types.PolyTransactionTags.Approve: {
      const args: TransactionArguments[types.PolyTransactionTags.Approve] =
        transaction.args;

      return {
        title: 'Approve',
        description: 'Approve',
      };
    }
    case types.PolyTransactionTags.CreateCheckpoint: {
      const args: TransactionArguments[types.PolyTransactionTags.CreateCheckpoint] =
        transaction.args;

      return {
        title: 'Create Checkpoint',
        description: 'Create Checkpoint',
      };
    }
    case types.PolyTransactionTags.CreateErc20DividendDistribution: {
      const args: TransactionArguments[types.PolyTransactionTags.CreateErc20DividendDistribution] =
        transaction.args;

      return {
        title: 'Create Erc20 Dividend Distribution',
        description: 'Create Erc20 Dividend Distribution',
      };
    }
    case types.PolyTransactionTags.CreateSecurityToken: {
      const args: TransactionArguments[types.PolyTransactionTags.CreateSecurityToken] =
        transaction.args;

      return {
        title: 'Create Security Token',
        description: 'Create Security Token',
      };
    }
    case types.PolyTransactionTags.EnableDividends: {
      const args: TransactionArguments[types.PolyTransactionTags.EnableDividends] =
        transaction.args;

      return {
        title: 'Enable Dividends',
        description: 'Enable Dividends',
      };
    }
    case types.PolyTransactionTags.GetTokens: {
      const args: TransactionArguments[types.PolyTransactionTags.GetTokens] =
        transaction.args;

      return {
        title: 'Get Tokens',
        description: 'Get Tokens',
      };
    }
    case types.PolyTransactionTags.ReclaimDividendFunds: {
      const args: TransactionArguments[types.PolyTransactionTags.ReclaimDividendFunds] =
        transaction.args;

      return {
        title: 'Reclaim Dividend Funds',
        description: 'Reclaim Dividend Funds',
      };
    }
    case types.PolyTransactionTags.ReserveSecurityToken: {
      const args: TransactionArguments[types.PolyTransactionTags.ReserveSecurityToken] =
        transaction.args;

      return {
        title: 'Reserve Security Token',
        description: 'Reserve Security Token',
      };
    }
    case types.PolyTransactionTags.SetErc20TaxWithholding: {
      const args: TransactionArguments[types.PolyTransactionTags.SetErc20TaxWithholding] =
        transaction.args;

      return {
        title: 'Set ERC20 Tax Withholding',
        description: 'Set ERC20 Tax Withholding',
      };
    }
    case types.PolyTransactionTags.SetEtherTaxWithholding: {
      const args: TransactionArguments[types.PolyTransactionTags.SetEtherTaxWithholding] =
        transaction.args;

      return {
        title: 'Set ETH tax Withholding',
        description: 'Set ETH tax Withholding',
      };
    }
    case types.PolyTransactionTags.WithdrawTaxWithholdings: {
      const args: TransactionArguments[types.PolyTransactionTags.WithdrawTaxWithholdings] =
        transaction.args;

      return {
        title: 'Withdraw Tax Withholdings',
        description: 'Withdraw Tax Withholdings',
      };
    }
    default: {
      return {
        title: '',
        description: '',
      };
    }
  }
};

// TODO @grsmto: update with the actual icons
export const getTransactionIcon = (transaction: types.TransactionPojo) =>
  ({
    [types.PolyTransactionTags.Any]: SvgErc20,
    [types.PolyTransactionTags.Approve]: SvgErc20,
    [types.PolyTransactionTags.GetTokens]: SvgErc20,
    [types.PolyTransactionTags.ReserveSecurityToken]: SvgErc20,
    [types.PolyTransactionTags.CreateSecurityToken]: SvgErc20,
    [types.PolyTransactionTags.CreateCheckpoint]: SvgErc20,
    [types.PolyTransactionTags.CreateErc20DividendDistribution]: SvgErc20,
    [types.PolyTransactionTags.CreateEtherDividendDistribution]: SvgErc20,
    [types.PolyTransactionTags.SetErc20TaxWithholding]: SvgErc20,
    [types.PolyTransactionTags.SetEtherTaxWithholding]: SvgErc20,
    [types.PolyTransactionTags.EnableDividends]: SvgErc20,
    [types.PolyTransactionTags.ReclaimDividendFunds]: SvgErc20,
    [types.PolyTransactionTags.WithdrawTaxWithholdings]: SvgErc20,
  }[transaction.tag]);
