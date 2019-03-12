import { types, formatters } from '@polymathnetwork/new-shared';
import { SvgErc20 } from '~/images/icons/Erc20';
import { ProcedureArguments, TransactionArguments } from '@polymathnetwork/sdk';

const getTransactionPositionData = (transaction: types.TransactionPojo, transactions: types.TransactionPojo[], tag: types.PolyTransactionTags) => {
  let total = 0;
  let position = 0;
  let indexFound = false;

  transactions.forEach(tx => {
    if (tx.tag === tag) {
      total += 1;

      if (!indexFound) {
        position += 1;
      }

      if (tx.uid === transaction.uid) {
        indexFound = true;
      }
    }
  });

  return {
    total,
    position,
  };
}

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
      const content = 'with the Creation of a Dividend Checkpoint';

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return `An error ocurred ${content}`;
        }
        case types.TransactionQueueStatus.Idle: {
          return `Proceed ${content}`;
        }
        case types.TransactionQueueStatus.Running: {
          return `Proceeding ${content}`;
        }
        case types.TransactionQueueStatus.Succeeded: {
          return 'Created a Dividend Checkpoint';
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.CreateErc20DividendDistribution: {
      const content = 'Your Dividend Configuration';

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return `An error ocurred with ${content}`;
        }
        case types.TransactionQueueStatus.Idle: {
          return `Proceed with ${content}`;
        }
        case types.TransactionQueueStatus.Running: {
          return `Proceeding with ${content}`;
        }
        case types.TransactionQueueStatus.Succeeded: {
          return `${content} was successfully submitted`;
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
      const content = 'the Ability to Distribute Dividends';
      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return `An error ocurred while Enabling ${content}`;
        }
        case types.TransactionQueueStatus.Idle: {
          return `Enable ${content}`;
        }
        case types.TransactionQueueStatus.Running: {
          return `Enabling ${content}`;
        }
        case types.TransactionQueueStatus.Succeeded: {
          return `Enabled ${content}`;
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
      const content = 'Withdrawing Withheld Taxes';

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return `An error ocurred while ${content}`;
        }
        case types.TransactionQueueStatus.Idle: {
          return `Proceed with ${content}`;
        }
        case types.TransactionQueueStatus.Running: {
          return `Proceeding with ${content}`;
        }
        case types.TransactionQueueStatus.Succeeded: {
          return 'Withheld Taxes were successfully withdrawn';
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.UpdateDividendsTaxWithholdingList: {
      const content = 'with updating of the Tax Withholdings List';
      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return `An error ocurred ${content}`;
        }
        case types.TransactionQueueStatus.Idle: {
          return `Proceed ${content}`;
        }
        case types.TransactionQueueStatus.Running: {
          return `Proceeding ${content}`;
        }
        case types.TransactionQueueStatus.Succeeded: {
          return `The Tax Withholdings List was successfully updated`;
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.PushDividendPayment: {
      const content = 'Your Dividend Distribution';

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return `${content} was partially submitted`;
        }
        case types.TransactionQueueStatus.Idle: {
          return `Proceed with ${content}`;
        }
        case types.TransactionQueueStatus.Running: {
          return `Proceeding with ${content}`;
        }
        case types.TransactionQueueStatus.Succeeded: {
          return `${content} was successfully submitted`;
        }
        default: {
          return '';
        }
      }
    }
    case types.ProcedureTypes.SetDividendsWallet: {
      const args: ProcedureArguments[types.ProcedureTypes.SetDividendsWallet] =
        queue.args;

      const content = 'Editing Storage Wallet Address';

      switch (status) {
        case types.TransactionQueueStatus.Failed: {
          return `An error ocurred while ${content}`;
        }
        case types.TransactionQueueStatus.Idle: {
          return `Proceed with ${content}`;
        }
        case types.TransactionQueueStatus.Running: {
          return `Proceeding with ${content}`;
        }
        case types.TransactionQueueStatus.Succeeded: {
          return `Storage Wallet Address updated`;
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
        title: 'Approve POLY Spend',
        description: 'Approve POLY Spend',
      };
    }
    case types.ProcedureTypes.CreateCheckpoint: {
      return {
        title: 'Create Dividend Checkpoint',
        description: `A Dividend Checkpoint will provide you with a snapshot of your token's distribution \
amongst shareholders at the time of its creation. This checkpoint can subsequently be used to determine how \
dividends are distributed and how applicable taxes are withheld. Creating a checkpoint will require one wallet \
transaction.`,
      };
    }
    case types.ProcedureTypes.CreateErc20DividendDistribution: {
      return {
        title: 'Proceed with Your Dividend Configuration',
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
      return {
        title: 'Enable the Ability to Distribute Dividends',
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
      return {
        title: 'Withdraw Withheld Taxes',
      };
    }
    case types.ProcedureTypes.UpdateDividendsTaxWithholdingList: {
      return {
        title: 'Update Tax Withholdings List',
      };
    }
    case types.ProcedureTypes.PushDividendPayment: {
      const { transactions } = queue;

      let investorCount = 0;

      transactions.forEach(transaction => {
        const txArgs: TransactionArguments[types.PolyTransactionTags.PushDividendPayment] =
          transaction.args;

        investorCount += txArgs.investorAddresses!.length;
      });

      return {
        title: 'Proceed with the Dividend Distribution',
        description: `Dividends will be distributed to ${investorCount} investors.

This operation will require ${transactions.length} wallet transactions.

Each transaction will be used to distribute dividends to up to 100 investors at a time.

Transactions may be resubmitted at a later time should a cancellation or error occur.`,
      };
    }
    case types.ProcedureTypes.SetDividendsWallet: {
      const args: ProcedureArguments[types.ProcedureTypes.SetDividendsWallet] =
        queue.args;

      return {
        title: 'Set Dividends Wallet',
        description: 'Set Dividends Wallet',
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
export const getTransactionTitle = (
  transaction: types.TransactionPojo,
  index: number,
  transactions: types.TransactionPojo[]
) => {
  const { tag } = transaction;

  switch (tag) {
    case types.PolyTransactionTags.Any: {
      return 'Unnamed Transaction';
    }
    case types.PolyTransactionTags.Approve: {
      const args: TransactionArguments[types.PolyTransactionTags.Approve] =
        transaction.args;

      return args.amount ?`Approving ${formatters.toTokens(args.amount)} POLY spend`:'';
    }
    case types.PolyTransactionTags.CreateCheckpoint: {
      return 'Creating a Dividend Checkpoint';
    }
    case types.PolyTransactionTags.CreateErc20DividendDistribution: {
      return 'Configuring Dividend Distribution';
    }
    case types.PolyTransactionTags.CreateSecurityToken: {
      const args: TransactionArguments[types.PolyTransactionTags.CreateSecurityToken] =
        transaction.args;

      return 'Create Security Token';
    }
    case types.PolyTransactionTags.EnableDividends: {
      const args: TransactionArguments[types.PolyTransactionTags.EnableDividends] =
        transaction.args;

      if (args.type === types.DividendModuleTypes.Erc20) {
        return 'Enabling the distribution of dividends in ERC20 Tokens, including POLY and stable coins.';
      }

      return 'Enable Dividends Module';
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
      const {position, total} = getTransactionPositionData(transaction, transactions, types.PolyTransactionTags.SetErc20TaxWithholding);

      return `Tax Withholding List Update #${position} of ${total}`;
    }
    case types.PolyTransactionTags.SetEtherTaxWithholding: {
      const {position, total} = getTransactionPositionData(transaction, transactions, types.PolyTransactionTags.SetEtherTaxWithholding);

      return `Tax Withholding List Update #${position} of ${total}`;
    }
    case types.PolyTransactionTags.WithdrawTaxWithholdings: {
      return 'Withdraw Withheld Taxes';
    }
    case types.PolyTransactionTags.PushDividendPayment: {
      const {position, total} = getTransactionPositionData(transaction, transactions, types.PolyTransactionTags.PushDividendPayment);

      return `Dividend Distribution #${position} of ${total}`;
    }
    case types.PolyTransactionTags.SetDividendsWallet: {
      const args: TransactionArguments[types.PolyTransactionTags.SetDividendsWallet] =
        transaction.args;

      return 'Set Dividends Wallet';
    }
    default: {
      return '';
    }
  }
};

// TODO @monitz87: use actual text. The arguments are already there and typesafe
export const getTransactionContent = (
  transaction: types.TransactionPojo,
  index: number,
  transactions: types.TransactionPojo[]
) => {
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
      return {
        title: 'This transaction will be used to create a Dividend Checkpoint.',
        description: 'Dividend Checkpoint',
      };
    }
    case types.PolyTransactionTags.CreateErc20DividendDistribution: {
      return {
        title:
          'This transaction will be used to configure the Dividend Distribution.',
        description: 'Dividend Distribution Configuration',
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
        title:
          'Enable the distribution of dividends in ERC20 Tokens, including POLY and stable coins.',
        description: 'Enable Dividend Distribution',
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
      const {position, total} = getTransactionPositionData(transaction, transactions, types.PolyTransactionTags.SetErc20TaxWithholding);
      return {
        title:
          'This transaction will be used to apply the changes submitted to the Tax Withholding List.',
        description: `#${position} of ${total}`,
      };
    }
    case types.PolyTransactionTags.SetEtherTaxWithholding: {
      const {position, total} = getTransactionPositionData(transaction, transactions, types.PolyTransactionTags.SetEtherTaxWithholding);
      return {
        title:
          'This transaction will be used to apply the changes submitted to the Tax Withholding List.',
        description: `#${position} of ${total}`,
      };
    }
    case types.PolyTransactionTags.WithdrawTaxWithholdings: {
      const args: TransactionArguments[types.PolyTransactionTags.WithdrawTaxWithholdings] =
        transaction.args;

      return {
        title:
          'This transaction will be used to withdraw taxes withheld during the dividends distribution.',
        description: 'Withdraw Withheld Taxes',
      };
    }
    case types.PolyTransactionTags.PushDividendPayment: {
      const args: TransactionArguments[types.PolyTransactionTags.PushDividendPayment] =
        transaction.args;

      // TODO @monitz87: deal with this after we decide how to handle "batching" multiple transactions into
      // one item.

      const {position, total} = getTransactionPositionData(transaction, transactions, types.PolyTransactionTags.PushDividendPayment);

      return {
        title: 'Distribute Dividends',
        description: `#${position} of ${total}`,
      };
    }
    case types.PolyTransactionTags.SetDividendsWallet: {
      const args: TransactionArguments[types.PolyTransactionTags.SetDividendsWallet] =
        transaction.args;

      return {
        title: 'Set Dividends Wallet',
        description: 'Set Dividends Wallet',
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
    [types.PolyTransactionTags.PushDividendPayment]: SvgErc20,
    [types.PolyTransactionTags.SetDividendsWallet]: SvgErc20,
  }[transaction.tag]);
